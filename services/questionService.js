import { sql } from "../database/database.js";

const allTopicQuestions = async (topic_id) => {
    return await sql`SELECT * FROM questions WHERE topic_id = ${topic_id}`;
}

const deleteQuestionsOfTopic = async (topic_id) =>  {
    await sql`DELETE FROM questions WHERE topic_id = ${topic_id}`;
}

const addQuestion = async (question_text, topic_id, user_id) => {
    await sql`INSERT INTO questions (question_text, topic_id, user_id) VALUES (${question_text}, ${topic_id}, ${user_id})`;
}

const questionWithId = async (id) => {
    return await sql`SELECT * FROM questions WHERE id = ${id}`;
}

export { allTopicQuestions, deleteQuestionsOfTopic, addQuestion, questionWithId};