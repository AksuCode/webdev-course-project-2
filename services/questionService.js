import { sql } from "../database/database.js";

const allTopicQuestions = async (topic_id) => {
    return await sql`SELECT * FROM questions WHERE topic_id = ${topic_id}`;
}

const deleteQuestionsOfTopic = async (topic_id) =>  {
    await sql`DELETE FROM questions WHERE topic_id = ${topic_id}`;
}

export { allTopicQuestions, deleteQuestionsOfTopic };