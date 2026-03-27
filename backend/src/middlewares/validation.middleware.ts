import * as v from "valibot";
import { AsyncHandler } from "../utils/handlers";

type RequestLocation = "body" | "query" | "params" | "headers" | "cookies";

export const validationMiddleware = (location: RequestLocation, schema: v.ObjectSchema<any, any>) =>
  AsyncHandler(async (req, res, next) => {
    const data = req[location];
    const validatedData = await v.parseAsync(schema, data, { abortEarly: true });
    res.locals.validatedData = validatedData;
    next();
  });
