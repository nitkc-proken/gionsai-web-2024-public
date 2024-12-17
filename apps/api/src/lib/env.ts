import { configDotenv } from "dotenv";
configDotenv();

export const env = process.env;

type Env = {
	PORT: string;
} & Record<string, string | undefined>;
