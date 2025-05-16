// src/config/swagger.ts
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "DevTinder API",
            version: "1.0.0",
            description: "DevTinder - Connect with fellow developers",
            contact: {
                name: "API Support"
            }
        }
    },
    apis: ["./src/docs/*.ts"]
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

// Export a function to plug into the Express app
export const setupSwagger = (app: Express) => {
    app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
