import pg from 'pg'
import { finalization } from 'process'

import { SETTINGS } from './settings'

const { Client } = pg
initDb()
async function initDb() {
  const client = new Client({ connectionString: SETTINGS.DB_URI })
  try {
    await client.connect()
    await client.query(`
        CREATE TABLE users (
        id serial PRIMARY KEY,
        username varchar(30) UNIQUE,
        hashed_password varchar(72) NOT NULL,
        enabled boolean DEFAULT TRUE,
        created_at timestamp DEFAULT now()
      );

      CREATE TABLE balances (
        id serial PRIMARY KEY,
        user_id int REFERENCES users (id),
        cash bigint NOT NULL DEFAULT 0 CHECK (cash >= 0),
        non_cash bigint NOT NULL DEFAULT 0 CHECK (non_cash >= 0),
        created_at timestamp DEFAULT now(),
        updated_at timestamp DEFAULT now()
      );

      CREATE TABLE transactions (
        id bigserial PRIMARY KEY,
        sender_id int REFERENCES users (id),
        receiver_id int REFERENCES users (id),
        amount bigint NOT NULL,
        transaction_type varchar(10),
        created_at timestamp DEFAULT now()
      );
    `)
    console.log('Database initialize successfully!')
  } catch (err) {
    console.log('Error')
  } finally {
    await client.end()
  }
}
