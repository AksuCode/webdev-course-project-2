import { sql } from "../database/database.js";

const allTopics = async () => {
    return await sql`SELECT * FROM topics ORDER BY name DESC`;
}

const addTopic = async (name, user_id) => {
    await sql`INSERT INTO topics (name, user_id) VALUES (${name}, ${user_id})`;
}

const deleteTopic = async (id) => {
    await sql`DELETE FROM topics WHERE id = ${id}`;
}

const topicWithId = async (id) => {
    return await sql`SELECT * FROM topics WHERE id = ${id}`;
}
 
export { allTopics, addTopic, deleteTopic, topicWithId }