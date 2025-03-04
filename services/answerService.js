import { sql } from "../database/database.js";

const allQuestionAnswers = async (question_id) => {
    return await sql`SELECT * FROM question_answers WHERE question_id = ${question_id}`;
}

const allAnswers = async () => {
    return await sql`SELECT * FROM question_answers`;
}

const deleteAnswers = async (question_id) =>  {
    await sql`DELETE FROM question_answers WHERE question_id = ${question_id}`;
}

const deleteAnswersWithOption = async (question_answer_option_id) => {
    await sql`DELETE FROM question_answers WHERE question_answer_option_id = ${question_answer_option_id}`;
}

const addAnswer = async (user_id, question_id, question_answer_option_id) => {
    await sql`INSERT INTO question_answers (user_id, question_id, question_answer_option_id) VALUES (${user_id}, ${question_id}, ${question_answer_option_id})`;
}

export { 
    allQuestionAnswers, 
    deleteAnswers, 
    addAnswer, 
    deleteAnswersWithOption, 
    allAnswers 
}