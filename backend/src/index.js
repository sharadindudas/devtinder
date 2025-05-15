import { server } from "./app.js";
import { PORT } from "./config/config.js";
import { connectMongoDB } from "./utils/mongodb.js";

// Connection to mongodb
connectMongoDB()
    .then(() => {
        // Connection to server
        server.listen(PORT, () => {
            console.log(`Server running on PORT ${PORT}`);
        });
    })
    .catch((err) => {
        if (err instanceof Error) {
            console.error(err.message);
        }
    });
