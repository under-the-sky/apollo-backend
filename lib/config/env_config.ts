import dotenv = require('dotenv');
import fs = require('fs');
import { options } from './swaggerconfig';

if (fs.existsSync(".env")) {
    console.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
} else {
    console.debug("Using .env.example file to supply config environment variables");
    dotenv.config({ path: ".env.example" });  // you can delete this after you create your own .env file!
}
export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const SESSION_SECRET = process.env["SESSION_SECRET"];
export const MONGODB_URI = prod ? process.env["MONGODB_URI"] : process.env["MONGODB_URI_LOCAL"];
export const OPTIONS = prod ? options.swaggerDefinition.host = 'api.tynb0622.com' : options;
if (!SESSION_SECRET) {
    console.error("No client secret. Set SESSION_SECRET environment variable.");
    process.exit(1);
}

if (!MONGODB_URI) {
    if (prod) {
        console.error("No mongo connection string. Set MONGODB_URI environment variable.");
    } else {
        console.error("No mongo connection string. Set MONGODB_URI_LOCAL environment variable.");
    }
    process.exit(1);
}
