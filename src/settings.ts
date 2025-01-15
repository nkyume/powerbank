import { config } from 'dotenv'

config()
export const SETTINGS = {
  DB_URI:
    process.env.DB_URI ||
    'postgresql://postgres:password@127.0.0.1:5432/bankdb',
  DB_IDLE_IN_TRANSACTION_TIMEOUT:
    process.env.DB_IDLE_IN_TRANSACTION_TIMEOUT || 60000,
  JWT_SECRET: process.env.JWT_SECRET || 'sekretniye svediniya',
  PORT: process.env.PORT || 8080,
}
