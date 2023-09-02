import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as topicController from "./controllers/topicController.js";
import * as registerController from "./controllers/registerController.js";
import * as loginController from "./controllers/loginController.js";
import * as questionController from "./controllers/questionController.js";
import * as answerOptionController from "./controllers/answerOptionController.js";

const router = new Router();

router.get("/", mainController.showMain)
    .get("/topics", topicController.showTopics)
    .post("/topics", topicController.postTopic)
    .post("/topics/:id/delete", topicController.deleteTopic)
    .get("/topics/:id", questionController.showQuestions)
    .post("/topics/:id/questions", questionController.addQuestion)
    .get("/topics/:id/questions/:qId", answerOptionController.showAnswerOption)
    .post("/topics/:id/questions/:qId/options", answerOptionController.addAnswerOption)
    .get("/auth/register", registerController.getRegister)
    .post("/auth/register", registerController.postRegister)
    .get("/auth/login", loginController.getLogin)
    .post("/auth/login", loginController.postLogin);

export { router };
