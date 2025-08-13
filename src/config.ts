import dotenv from "dotenv";

dotenv.config();

export const appConfig = {
  port: process.env.PORT || 8000,
  jwtSecret: process.env.JWT_SECRET || "secretplaceholder",
};


// TAMBAHIN JWT_SECRET DI ENV, CONFIG.ts TAMBAHIN jwtSecret

// AYCE SECRET SUSHI = LOLOS KE FINPRO