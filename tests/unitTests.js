// testing imports:
import { assertEquals } from "../deps.js";
import { validasaur } from "../deps.js";
import { bcrypt } from "../deps.js";



// MOCK IMPORTS:

// Context mock
import { context } from "./mocks.js";

// Database getter mock functions
import { getUser } from "./mocks.js";
import { getStatistics } from "./mocks.js";

// Session getter mock function
import { getSession } from "./mocks.js";

// Redirect path getter function
import { getRedirPath } from "./mocks.js";

// Service mocks
import * as answerOptionService from "./mocks.js";
import * as questionService from "./mocks.js";
import * as userService from "./mocks.js";
import * as answerService from "./mocks.js";
import * as topicService from "./mocks.js";



// Register: postRegister test
//******************************************************************************* */
const registerDataValidationRules = {
  email: [validasaur.required, validasaur.isEmail],
  password: [validasaur.required, validasaur.minLength(4)],
}

const postRegister = async ({ request, response, render }) => {
  
  const body = request.body; // Small change here for testing .body({type:"json"}) => .body
  const params = await body.value;

  const data = {
      password: params.password, // Small change here for testing no get
      email: params.email, // Small change here for testing no get
      errors: {},
  }

  const [passes, errors] = await validasaur.validate(data, registerDataValidationRules);

  if (passes) {

      if (!(await userService.userExists(data.email))) {
          const hash = await bcrypt.hash(data.password);
          await userService.addUser(data.email, hash);
          response.redirect("/auth/login");
      }

      else {
          data.errors = {email: { duplicate: "User already exists."}};
          render("register.eta", data);
      }
  }

  else {
      data.errors = errors;
      render("register.eta", data);
  }

}


Deno.test("Register: postRegister works as expected.", async () => {

  context.request.body.value = {
                            password: "$2a$10$IML8QCf6xA.alRbW.CG5PuvYc3Qs94vJvoTwbsSehs8s515cUMuZa",
                            email: "test@test.fi",
                          }

  // New user will have id = 2

  await postRegister(context);
  assertEquals(getUser(2).email, "test@test.fi");

})
//******************************************************************************* */


// Login: postLogin test wrong credentials
//******************************************************************************* */
const postLogin = async ({ request, response, render, state}) => {

  const body = request.body; // Small change here for testing .body({type:"json"}) => .body
  const params = await body.value;

  const password = params.password; // Small change here for testing no get
  const email = params.email; // Small change here for testing no get

  const user = (await userService.getUserWithEmail(email))[0];

  if(user) {

      const hash = user.password;

      if (await bcrypt.compare(password, hash)) {
          await state.session.set("authenticated", true);
          await state.session.set("user", {
              id: user.id,
              admin: user.admin,
          });
          response.redirect("/topics");
      }

      else {
          const data = { error: "Failed to login! Incorrect password or email."};
          render("login.eta", data);
      }

  }

  else {
      const data = { error: "Failed to login! Incorrect password or email."};
      render("login.eta", data);
  }
}


Deno.test("Login: postLogin works as expected. No session found.", async () => {

  context.request.body.value = {
                            password: "wrong_password",
                            email: "A@A.fi",
                          }

  // There should be no session

  await postLogin(context);
  assertEquals(getSession(), {});

})
//******************************************************************************* */


// Login: postLogin test
//******************************************************************************* */
Deno.test("Login: postLogin works as expected. Session found", async () => {

  context.request.body.value = {
                            password: "123456",
                            email: "A@A.fi",
                          }

  // Admin will have id = 1

  await postLogin(context);
  assertEquals(getSession().user.id, 1);

})
//******************************************************************************* */


// Main: showMain test
//******************************************************************************* */
const showMain = async ({ render }) => {

  const data = {
    question_count: (await questionService.allQuestions()).length,
    answer_count: (await answerService.allAnswers()).length,
    topic_count: (await topicService.allTopics()).length,
  }

  render("main.eta", data);
};


Deno.test("Main: showMain works as expected.", async () => {

  await showMain(context);
  assertEquals(getStatistics(), 
                                    {
                                      question_count: 1,
                                      answer_count: 0,
                                      topic_count: 1,
                                    }
              );

})
//******************************************************************************* */


// Quiz: randomTopicQuestion test
//******************************************************************************* */
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


Deno.test("Quiz: randomTopicQuestion works as expected.", async () => {

  context.params = {tId: 1}

  await randomTopicQuestion(context);
  assertEquals(getRedirPath(), "/quiz/1/questions/1");

})
//******************************************************************************* */


// API: randomQuestion test
//******************************************************************************* */
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


Deno.test("API: randomQuestion works as expected.", async () => {

  await randomQuestion(context);
  assertEquals(context.response.body, {
    "questionId": 1,
    "questionText": "Test_question",
    "answerOptions": [
      { "optionId": 1, "optionText": "True" },
      { "optionId": 2, "optionText": "False" },
    ]
  });

})
//******************************************************************************* */


// API: answer test correct
//******************************************************************************* */
const answer = async ({ request, response }) => {

  const body = request.body; // Small change here for testing .body({type:"json"}) => .body
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


Deno.test("API: answer works as expected. Correct.", async () => {

  context.request.body.value = {
                            "questionId": 1,
                            "optionId": 1,
                          };

  await answer(context);
  assertEquals(context.response.body, { "correct": true } );

})
//******************************************************************************* */


// API: answer test incorrect
//******************************************************************************* */
Deno.test("API: answer works as expected. Incorrect.", async () => {

  context.request.body.value = {
                            "questionId": 1,
                            "optionId": 2,
                          };

  await answer(context);
  assertEquals(context.response.body, { "correct": false } );

})
//******************************************************************************* */