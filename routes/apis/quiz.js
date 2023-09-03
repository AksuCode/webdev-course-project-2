import * as questionService from "../../services/questionService.js";
import * as answerOptionService from "../../services/answerOptionService.js";



const randomQuestion = async ({ response }) => {

    const questions = await questionService.allQuestions();
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

        const question = questions_with_options[random_index];
        const options = await answerOptionService.allQuestionAnsOptions(question.id);
        const answerOptions = [];
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            answerOptions.push({ "optionId": option.id, "optionText": option.option_text});
        }

        response.body = {
            "questionId": question.id,
            "questionText": question.question_text,
            "answerOptions": answerOptions,
        };
    }

    else {
        response.body = {};
    }

}



const answer = async ({ request, response }) => {

    const body = request.body({type: "json"});
    const document = await body.value;
    const option_id = document.optionId;

    if (option_id) {
        
        const option_id = document.optionId;

        const option = (await answerOptionService.optionWithId(option_id))[0];

        if (option.is_correct) {
            response.body = { "correct": true };
        }

        else {
            response.body = { "correct": false };
        }
    }

    else {
        response.body = { "correct": false};
    }

}



export { randomQuestion, answer }