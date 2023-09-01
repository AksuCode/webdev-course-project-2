import { bcrypt } from "../../deps.js";
import * as userService from "../../services/userService.js";



const getLogin = ({ render }) => {
    const data = { error: ""};
    render("login.eta", data);
}



const postLogin = async ({ request, response, render, state}) => {

    const body = request.body();
    const params = await body.value;

    const password = params.get("password");
    const email = params.get("email");

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



export { getLogin, postLogin }