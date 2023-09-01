import { sql } from "../database/database.js";

const allQuestionAnsOptions = async (question_id) => {
    return await sql`SELECT * FROM question_answer_options WHERE question_id = ${question_id}`;
}

const deleteAnsOptionsOfQuestion = async (question_id) =>  {
    await sql`DELETE FROM question_answer_options WHERE question_id = ${question_id}`;
}

export { allQuestionAnsOptions, deleteAnsOptionsOfQuestion }