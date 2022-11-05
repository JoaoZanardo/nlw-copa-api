import { App } from "./app";

(async (): Promise<void> => {
    try {
        const server = new App();
        await server.init();
        await server.start();
    } catch (error) {
        console.log(`Error starting server: ${error}`);
        process.exit(1);
    }
})();
