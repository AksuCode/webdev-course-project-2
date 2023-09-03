import { validasaur } from "../../deps.js";
import * as questionService from "../../services/questionService.js";
import * as answerOptionService from "../../services/answerOptionService.js";
import * as answerService from "../../services/answerService.js";



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



const addAnswerOption = async ({ params, request, render , response}) => {

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



const deleteAnswerOption = async ({ params, response }) => {

    const topic_id = params.tId;
    const question_id = params.qId;
    const option_id = params.oId;

    await answerService.deleteAnswersWithOption(option_id);
    await answerOptionService.deleteAnsOption(option_id);
    response.redirect(`/topics/${topic_id}/questions/${question_id}`);

}


export { showAnswerOption, addAnswerOption, deleteAnswerOption }