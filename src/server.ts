import { app } from "./app";

(async () => {
    await app.listen({ port: 3000, host: '0.0.0.0' });
})();