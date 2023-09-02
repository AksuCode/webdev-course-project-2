import { validasaur } from "../../deps.js";
import * as questionService from "../../services/questionService.js";
import * as answerOptionService from "../../services/answerOptionService.js";



const showAnswerOption = async ({ params, render, state }) => {

    const topic_id = params.id;
    const question_id = params.qId;

    const data = {
        answer_options: await answerOptionService.allQuestionAnsOptions(question_id),
        question: (await questionService.questionWithId(question_id))[0],
        option_text: "",
        authenticated: await state.session.get("authenticated") === true,
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
        authenticated: await state.session.get("authenticated") === true,
        errors: {},
    }

    if (data.authenticated) {
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



const deleteAnswerOption = async ({ params, response , state}) => {

    const topic_id = params.tId;
    const question_id = params.qId;
    const option_id = params.oId;

    if (await state.session.get("authenticated")) {
        answerOptionService.deleteAnsOption(option_id);
        response.redirect(`/topics/${topic_id}/questions/${question_id}`);
    }

    else {
        response.redirect(`/topics/${topic_id}/questions/${question_id}`);
    }

}


export { showAnswerOption, addAnswerOption, deleteAnswerOption }