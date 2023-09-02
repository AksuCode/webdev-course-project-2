import { validasaur } from "../../deps.js";
import * as questionService from "../../services/questionService.js";
import * as answerOptionService from "../../services/answerOptionService.js";



const showAnswerOption = async ({ params, render }) => {

    const topic_id = params.id;
    const question_id = params.qId;

    const data = {
        answer_options: await answerOptionService.allQuestionAnsOptions(question_id),
        question: (await questionService.questionWithId(question_id))[0],
        option_text: "",
        errors: {},
    }

    render("answer_options.eta", data);
}



const optionDataValidationRules = {
    option_text: [validasaur.required, validasaur.minLength(1)],
}



const addAnswerOption = async ({ params, request, state, render , response}) => {

    const body = request.body();
    const formData = await body.value;
    const topic_id = params.id;
    const question_id = params.qId;
    const path = request.url.pathname;

    const data = {
        answer_options: await answerOptionService.allQuestionAnsOptions(question_id),
        question: (await questionService.questionWithId(question_id))[0],
        option_text: formData.get("option_text"),
        errors: {},
    }

    if (await state.session.get("authenticated")) {
        const [passes, errors] = await validasaur.validate(data, optionDataValidationRules);
        if (passes) {
            const is_correct = formData.get("is_correct") !== null;
            await answerOptionService.addAnswerOption(question_id , data.option_text, is_correct);
            response.redirect(`/topics/${topic_id}/questions/${question_id}`);
        }

        else {
            data.errors = errors;
            render("answer_options.eta", data);
        }
    }

    else {
        response.redirect(`/topics/${topic_id}/questions/${question_id}`);
    }

}


export { showAnswerOption, addAnswerOption }