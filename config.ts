import crypto from "crypto";

const config = crypto.randomBytes(32).toString("base64url");

console.log(config);
