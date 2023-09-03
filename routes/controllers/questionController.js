import * as questionService from "../../services/questionService.js";
import * as answerOptionService from "../../services/answerOptionService.js";
import * as topicService from "../../services/topicService.js";
import { validasaur } from "../../deps.js";



const showQuestions = async ({ params, render }) => {

    const topic_id = params.id;

    const data = {
        questions: await questionService.allTopicQuestions(topic_id),
        topic: (await topicService.topicWithId(topic_id))[0],
        question_text: "",
        errors: {},
    }

    for (let i = 0; i < data.questions.length; i++) {
        const question = data.questions[i];
        question.delete_allowed = (await answerOptionService.allQuestionAnsOptions(question.id)).length < 1;
        data.questions[i] = question;
    }

    render("questions.eta", data);
}



const questionDataValidationRules = {
    question_text: [validasaur.required, validasaur.minLength(1)],
}



const addQuestion = async ({ params, request, state, render , response}) => {

    const body = request.body();
    const formData = await body.value;
    const topic_id = params.id;

    const data = {
        questions: await questionService.allTopicQuestions(topic_id),
        topic: (await topicService.topicWithId(topic_id))[0],
        question_text: formData.get("question_text"),
        errors: {},
    }

    for (let i = 0; i < data.questions.length; i++) {
        const question = data.questions[i];
        question.delete_allowed = (await answerOptionService.allQuestionAnsOptions(question.id)).length < 1;
        data.questions[i] = question;
    }


    const [passes, errors] = await validasaur.validate(data, questionDataValidationRules);
    if (passes) {
        const user_id = (await state.session.get("user")).id;
        await questionService.addQuestion(data.question_text, topic_id, user_id);
        response.redirect(`/topics/${topic_id}`);
    }

    else {
        data.errors = errors;
        response.pathname = `/topics/${topic_id}`;
        render("questions.eta", data);
    }

}



const deleteQuestion = async ({ params, response }) => {

    const topic_id = params.tId;
    const question_id = params.qId;


    if ((await answerOptionService.allQuestionAnsOptions(question_id)).length < 1) {
        await questionService.deleteQuestion(question_id);
        response.redirect(`/topics/${topic_id}`);
    }

    else {
        response.redirect(`/topics/${topic_id}/questions/${question_id}`);
    }

}


export { showQuestions, addQuestion, deleteQuestion }