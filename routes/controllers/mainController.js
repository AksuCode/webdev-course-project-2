import * as questionService from "../../services/questionService.js";
import * as answerService from "../../services/answerService.js";
import * as topicService from "../../services/topicService.js";

const showMain = async ({ render }) => {

  const data = {
    question_count: (await questionService.allQuestions()).length,
    answer_count: (await answerService.allAnswers()).length,
    topic_count: (await topicService.allTopics()).length,
  }

  render("main.eta", data);
};

export { showMain };
