import { sql } from "../database/database.js";

const allQuestionAnsOptions = async (question_id) => {
    return await sql`SELECT * FROM question_answer_options WHERE question_id = ${question_id}`;
}

const deleteAnsOptionsOfQuestion = async (question_id) =>  {
    await sql`DELETE FROM question_answer_options WHERE question_id = ${question_id}`;
}

const addAnswerOption = async (question_id, option_text, is_correct) => {
    await sql`INSERT INTO question_answer_options (question_id, option_text, is_correct) VALUES (${question_id}, ${option_text}, ${is_correct})`;
}

const deleteAnsOption = async (id) => {
    await sql`DELETE FROM question_answer_options WHERE id = ${id}`;
}

export { allQuestionAnsOptions, deleteAnsOptionsOfQuestion, addAnswerOption, deleteAnsOption }