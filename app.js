import { Application } from "./deps.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { renderMiddleware } from "./middlewares/renderMiddleware.js";
import { serveStaticMiddleware } from "./middlewares/serveStaticMiddleware.js";
import { aclMiddleware } from "./middlewares/aclMiddleware.js";
import { router } from "./routes/routes.js";
import { Session } from "./deps.js";

const app = new Application();

app.use(errorMiddleware);
app.use(Session.initMiddleware());
app.use(aclMiddleware);
app.use(serveStaticMiddleware);
app.use(renderMiddleware);
app.use(router.routes());

export { app };