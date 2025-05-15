import winston from "winston";
import { NODE_ENV } from "../config/config";
import path from "path";

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

const level = () => {
    const env = NODE_ENV || "development";
    const isDevelopment = env === "development";
    return isDevelopment ? "debug" : "warn";
};

const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white"
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: path.resolve(process.cwd(), "../../logs/error.log"),
        level: "error"
    }),
    new winston.transports.File({ filename: path.resolve(process.cwd(), "../../logs/all.log") })
];

export const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports
});
