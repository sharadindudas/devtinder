import { server } from "./app";
import { PORT } from "./config/config";
import { connectMongoDB } from "./utils/mongodb";
import { logger } from "./utils/logger";
import * as path from "path";

(async () => {
    // Connection to mongodb
    await connectMongoDB();
    // Connection to server
    server.listen(PORT, () => {
        logger.info(`Server running on PORT ${PORT}`);
    });
})();

console.log(path.resolve(__dirname, "../logs"));
