const acl = [

    {
    path: "/",
    auhtNeeded: false,
    needsRole: ["ADMIN"],
    }

]

const aclMiddleware = async ({ request, response, state }, next) => {
    const pathName = request.url.pathname;

    for (let i = 0; i < acl.length; i++) {
        const rules = acl[i];




    }
}