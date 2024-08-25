// const env : string = "LOCAL"
const env = "PRODUCTION"
export const BE_URL: string = env == "PRODUCTION" ? process.env.BE_URL as string : process.env.BE_URL_LOCAL as string;
export const X_API_KEY: string =  env == "PRODUCTION" ? process.env.X_API_KEY as string : process.env.X_API_KEY_LOCAL as string ;
export const FRONT_URL: string =  env == "PRODUCTION" ? process.env.FRONT_URL as string : process.env.FRONT_URL_LOCAL as string;

