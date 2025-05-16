import { server } from "./app";
import { PORT, SERVER_URL } from "./config/config";
import { connectMongoDB } from "./config/mongodb";
import { logger } from "./utils/logger";

(async () => {
    // Connection to mongodb
    await connectMongoDB();
    // Connection to server
    server.listen(PORT, () => {
        logger.info(`Server running on ${SERVER_URL}`);
    });
})();
