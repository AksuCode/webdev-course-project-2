import { bcrypt } from "../../deps.js";
import { validasaur } from "../../deps.js";
import * as userService from "../../services/userService.js";



const getRegister = ({ render }) => {
    const data = { email: "",}
    render("register.eta", data);
}



const registerDataValidationRules = {
    email: [validasaur.required, validasaur.isEmail],
    password: [validasaur.required, validasaur.minLength(4)],
}



const postRegister = async ({ request, response, render }) => {
    
    const body = request.body();
    const params = await body.value;

    const data = {
        password: params.get("password"),
        email: params.get("email"),
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



export {
    getRegister,
    postRegister
}