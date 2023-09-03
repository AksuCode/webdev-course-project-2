const acl = [

    {
        path: "/api",
        auth_needed: false,
    },
    {
        path: "/auth",
        auth_needed: false,
    },
    {
        path: "/topics",
        auth_needed: true,
    },
    {
        path: "/quiz",
        auth_needed: true,
    },
    {
        path: "/",
        auth_needed: false,
    }

]



const aclMiddleware = async ({ request, response, state }, next) => {
    const pathname = request.url.pathname;

    for (let i = 0; i < acl.length; i++) {
        const rule = acl[i];

        if (!pathname.startsWith(rule.path)) {
            continue;
        }
        
        if (!rule.auth_needed) {
            await next();
            return;
        }

        if (!(await state.session.get("authenticated"))) {
            response.redirect("/auth/login");
            return;
        }

        await next();
        return;
    }

    response.redirect("/");
}



export { aclMiddleware }