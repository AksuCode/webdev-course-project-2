import { sql } from "../database/database.js";

const addUser = async (email, password) => {
    await sql`INSERT INTO users (email, password) VALUES (${email}, ${password})`;
}

const getUserWithEmail = async (email) => {
    return await sql`SELECT * FROM users WHERE email = ${email}`;
}

const userExists = async (email) => {
    return ((await sql`SELECT * FROM users WHERE email = ${email}`).length >= 1);
}

export { addUser, getUserWithEmail, userExists }