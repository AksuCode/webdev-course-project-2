import * as topicService from "../../services/topicService.js";
import * as questionService from "../../services/questionService.js";
import * as answerOptionService from "../../services/answerOptionService.js";
import * as answerService from "../../services/answerService.js";



const showQuizTopics = async ({ render }) => {

    const data = {
        topics: await topicService.allTopics(),
    }

    render("quiz_topics.eta", data);
}



const randomTopicQuestion = async ({ response, params, render }) => {

    const topic_id = params.tId;
    const questions = await questionService.allTopicQuestions(topic_id);
    const questions_with_options = [];

    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        
        if ((await answerOptionService.allQuestionAnsOptions(question.id)).length >= 1) {
            questions_with_options.push(question);
        }
    }

    const question_amount = questions_with_options.length;
    if (question_amount > 0) {
        const min = Math.ceil(0);
        const max = Math.floor(question_amount - 1);
        const random_index = Math.floor(Math.random() * (max - min + 1) + min);

        const question_id = questions_with_options[random_index].id;
        response.redirect(`/quiz/${topic_id}/questions/${question_id}`);
    }

    else {

        const data = {
            question: {},
            answer_options: [],
            question_found: false,
        }

        render("quiz_question.eta", data);
    }

}



const showQuizQuestion = async ({ render, params }) => {

    const question_id = params.qId;

    const data = {
        question: (await questionService.questionWithId(question_id))[0],
        answer_options: await answerOptionService.allQuestionAnsOptions(question_id),
        question_found: true,
    }

    render("quiz_question.eta", data);
}



const handleAnswer = async ({ response, params, state }) => {

    const topic_id = params.tId;
    const question_id = params.qId;
    const option_id = params.oId;

    const user_id = (await state.session.get("user")).id;

    await answerService.addAnswer(user_id, question_id, option_id);

    const chosen_option = (await answerOptionService.optionWithId(option_id))[0];

    if (chosen_option.is_correct) {
        response.redirect(`/quiz/${topic_id}/questions/${question_id}/correct`);
    }

    else {
        response.redirect(`/quiz/${topic_id}/questions/${question_id}/incorrect`);
    }

}



const showAnswerResult = async ({ render, params }) => {

    const topic_id = params.tId;
    const question_id = params.qId;
    const correct = "correct" === params.result;

    const data = {
        correct: correct,
        topic_id: topic_id,
        correct_answer: "",
    }

    if (correct) {
        render("quiz_result.eta", data);
    }

    else {
        data.correct_answer = (await answerOptionService.questionAnswers(question_id))[0].option_text;
        render("quiz_result.eta", data);
    }
}



export { 
    showQuizTopics, 
    randomTopicQuestion, 
    showQuizQuestion, 
    handleAnswer, 
    showAnswerResult,
}