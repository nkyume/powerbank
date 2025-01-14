import { DatabaseError, QueryResultRow } from 'pg'

import { getClient } from './'

export type UserType = {
  id: number
  username: string
  hashed_password: string
  enabled: boolean
  registration_date: Date
}

export type userCreateDbModel = {
  username: string
  hashed_password: string
}

export class Users {
  public async create(user: userCreateDbModel): Promise<boolean> {
    const client = await getClient()
    const createUser = `
      INSERT INTO users (username, hashed_password)
        VALUES ($1, $2)
      RETURNING
        id;
    `
    const createBalance = `
      INSERT INTO balances (user_id)
        VALUES ($1);
    `
    try {
      client.query('BEGIN')
      const res = await client.query(createUser, [
        user.username,
        user.hashed_password,
      ])
      await client.query(createBalance, [res.rows[0].id])
      await client.query('COMMIT')
      return true
    } catch (err) {
      await client.query('ROLLBACK')
      // if username already exists in database
      if (err instanceof DatabaseError && err.code === '23505') {
        return false
      }
      console.log(err)
      throw err
    } finally {
      client.release()
    }
  }

  public async findMultiple(
    like: string,
    limit: number,
    offset: number
  ): Promise<UserType[]> {
    const client = await getClient()
    const getUsers = `
      SELECT
        id,
        username,
        enabled,
        created_at
      FROM
        users
      WHERE
        username LIKE $1
      ORDER BY
        username ASC
      LIMIT $2 OFFSET $3
    `
    like = like + '%'
    try {
      const res = await client.query(getUsers, [like, limit, offset])
      const users = res.rows.map((user) => this.getUserType(user))
      return users
    } catch (err) {
      console.log(err)
      throw err
    } finally {
      client.release()
    }
  }

  public async findByUsername(username: string): Promise<UserType> {
    const client = await getClient()
    const getUser = `
      SELECT
        id,
        username,
        hashed_password,
        enabled,
        created_at
      FROM
        users
      WHERE
        username = $1;
    `
    try {
      const res = await client.query(getUser, [username])
      return this.getUserType(res.rows[0])
    } catch (err) {
      console.log(err)
      throw err
    } finally {
      client.release()
    }
  }

  private getUserType(user: QueryResultRow): UserType {
    return {
      id: user?.id,
      username: user?.username,
      hashed_password: user?.hashed_password,
      enabled: user?.enabled,
      registration_date: user?.created_at,
    }
  }
}
