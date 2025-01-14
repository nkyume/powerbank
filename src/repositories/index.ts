import pg from 'pg'

import { SETTINGS } from '../settings'

const { Pool } = pg

const pool = new Pool({
  connectionString: SETTINGS.DB_URI,
  idle_in_transaction_session_timeout: +SETTINGS.DB_IDLE_IN_TRANSACTION_TIMEOUT,
})

export const dbDisconnect = async () => {
  await pool.end()
}
export const getClient = () => {
  return pool.connect()
}
