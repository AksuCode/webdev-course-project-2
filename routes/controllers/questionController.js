import * as questionService from "../../services/questionService.js";
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

    if (await state.session.get("authenticated")) {
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

    else {
        response.redirect(`/topics/${topic_id}`);
    }

}


export { showQuestions, addQuestion }