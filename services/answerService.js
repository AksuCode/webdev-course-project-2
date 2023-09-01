import { sql } from "../database/database.js";

const allQuestionAnswers = async (question_id) => {
    return await sql`SELECT * FROM question_answers WHERE question_id = ${question_id}`;
}

const deleteAnsOptionsOfQuestion = async (question_id) =>  {
    await sql`DELETE FROM question_answers WHERE question_id = ${question_id}`;
}

export { allQuestionAnswers, deleteAnsOptionsOfQuestion }