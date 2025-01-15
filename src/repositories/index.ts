import pg, { PoolClient } from 'pg'

import { SETTINGS } from '../settings'

const { Pool } = pg

const pool = new Pool({
  connectionString: SETTINGS.DB_URI,
  idle_in_transaction_session_timeout: +SETTINGS.DB_IDLE_IN_TRANSACTION_TIMEOUT,
})

export const db = {
  withTransaction: async (client: PoolClient, callback: Function) => {
    try {
      client.query('BEGIN')
      await callback()
      client.query('COMMIT')
    } catch (err) {
      client.query('ROLLBACK')
      throw err
    }
  },
  disconnect: async () => {
    await pool.end()
  },
  getClient: () => {
    return pool.connect()
  },
}
