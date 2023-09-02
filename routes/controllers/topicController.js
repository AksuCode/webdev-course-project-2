import * as topicService from "../../services/topicService.js";
import { validasaur } from "../../deps.js";
import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";
import * as answerOptionService from "../../services/answerOptionService.js";


const showTopics = async ({ render, state}) => {

    const data = {
        topics: await topicService.allTopics(),
        topic_name: "",
        admin: false,
    }

    if (await state.session.get("authenticated")) {
        if ((await state.session.get("user")).admin) {
            data.admin = true;
        }
    }

    render("topics.eta", data);
}




const topicDataValidationRules = {
    topic_name: [validasaur.required, validasaur.minLength(1)],
}



const postTopic = async ( {request, response, state, render}) => {

    const body = request.body();
    const params = await body.value;

    if (await state.session.get("authenticated")) {
        if ((await state.session.get("user")).admin) {    

            const data = {
                topics: await topicService.allTopics(),
                topic_name: params.get("name"),
                admin: true,
                errors: {},
            }

            const [passes, errors] = await validasaur.validate(data, topicDataValidationRules);
            if(passes) {
                const id = (await state.session.get("user")).id;
                await topicService.addTopic(data.topic_name, id);
                response.redirect("/topics");
            }

            else {
                data.errors = errors;
                render("topics.eta", data);
            }

        }

        else {
            response.redirect("/topics");
        }
    }

    else {
        response.redirect("/topics");
    }

}



const deleteTopic = async ({ params, response , state}) => {

    const topic_id = params.id;

    if (await state.session.get("authenticated")) {
        if ((await state.session.get("user")).admin) {    
            
            const allTopicQuestions = await questionService.allTopicQuestions(topic_id);

            if (allTopicQuestions.length > 0) {
                for (let i = 0; i < allTopicQuestions.length; i++) {
                    const question_id = (allTopicQuestions[i]).id;
                    await answerService.deleteAnswers(question_id);
                    await answerOptionService.deleteAnsOptionsOfQuestion(question_id);
                }
                await questionService.deleteQuestionsOfTopic(topic_id);
            }
            
            await topicService.deleteTopic(topic_id);

            response.redirect("/topics");
        }

        else {
            response.redirect("/topics");
        }
    }

    else {
        response.redirect("/topics");
    }

}


export { showTopics, postTopic, deleteTopic }