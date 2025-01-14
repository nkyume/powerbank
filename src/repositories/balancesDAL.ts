import { PoolClient, QueryResultRow } from 'pg'

import { getClient } from '.'

export type BalanceType = {
  username: string
  cash: number
  nonCash: number
  updatedAt: Date
}

export type TransactionType = {
  senderUsername: string
  receiverUsername: string
  amount: number
  type: string
  date: Date
}

type addBalanceModel = {
  username: string
  cash: number
  nonCash: number
}

export class Balances {
  public async findByUsername(username: string): Promise<BalanceType> {
    const client = await getClient()
    try {
      const findBalanceQuery = `
        SELECT
          u.username,
          b.cash,
          b.non_cash,
          b.updated_at
        FROM
          users u
          JOIN balances b ON u.id = b.user_id
        WHERE
          u.username = $1;
      `
      const res = await client.query(findBalanceQuery, [username])
      return this.getBalanceModel(res.rows[0])
    } catch (err) {
      console.log(err)
      throw err
    } finally {
      client.release()
    }
  }

  private getBalanceModel(balance: QueryResultRow): BalanceType {
    return {
      username: balance.username,
      cash: +balance.cash,
      nonCash: +balance.non_cash,
      updatedAt: balance.updated_at,
    }
  }

  public async findTransactions(username: string): Promise<TransactionType[]> {
    const client = await getClient()
    const findTransactionQuery = `
      SELECT
        sender.username AS sender_username,
        receiver.username AS receiver_username,
        t.amount,
        t.transaction_type,
        t.created_at
      FROM
        transactions t
        JOIN users AS sender ON sender.id = t.sender_id
        JOIN users AS receiver ON receiver.id = t.receiver_id
      WHERE
        sender.username = $1 OR receiver.username = $1
      ORDER BY
        t.created_at DESC;
    `
    try {
      const res = await client.query(findTransactionQuery, [username])
      return res.rows.map((transaction): TransactionType => {
        return {
          senderUsername: transaction.sender_username,
          receiverUsername: transaction.receiver_username,
          amount: +transaction.amount,
          type: transaction.transaction_type,
          date: transaction.created_at,
        }
      })
    } catch (err) {
      console.log(err)
      throw err
    } finally {
      client.release()
    }
  }

  // TODO: refactor this mess
  public async createTransaction(
    transaction: transactionCreateModel
  ): Promise<void> {
    const client = await getClient()
    const createTransactionStmt = `
      INSERT INTO transactions (sender_id, receiver_id, amount, transaction_type)
        VALUES (
          (SELECT id FROM users WHERE username = $1), 
          (SELECT id FROM users WHERE username = $2),
          $3,
          $4);
    `
    try {
      await client.query('BEGIN')
      await client.query(createTransactionStmt, [
        transaction.sender,
        transaction.receiver,
        transaction.amount,
        transaction.type,
      ])
      await this.resolveTransaction(transaction, client)
      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      console.log(err)
      throw err
    } finally {
      client.release()
    }
  }
  private async resolveTransaction(
    transaction: transactionCreateModel,
    client: PoolClient
  ) {
    switch (transaction.type) {
      case 'deposit': {
        await this.addToBalance(
          {
            username: transaction.sender,
            cash: -transaction.amount,
            nonCash: transaction.amount,
          },
          client
        )
        break
      }
      case 'withdraw': {
        await this.addToBalance(
          {
            username: transaction.sender,
            cash: transaction.amount,
            nonCash: -transaction.amount,
          },
          client
        )
        break
      }
      case 'transfer': {
        await this.addToBalance(
          {
            username: transaction.sender,
            cash: 0,
            nonCash: -transaction.amount,
          },
          client
        )
        await this.addToBalance(
          {
            username: transaction.receiver,
            cash: 0,
            nonCash: transaction.amount,
          },
          client
        )
        break
      }
      case 'payment': {
        await this.addToBalance(
          {
            username: transaction.receiver,
            cash: 0,
            nonCash: transaction.amount,
          },
          client
        )
        break
      }
    }
  }

  private async addToBalance(
    balance: addBalanceModel,
    client: PoolClient
  ): Promise<void> {
    const updateBalanceStmt = `
      UPDATE
        balances
      SET
        (cash, non_cash, updated_at) = (cash + $1, non_cash + $2, now())
      WHERE
        user_id = (SELECT id FROM users WHERE username = $3);
    `
    await client.query(updateBalanceStmt, [
      balance.cash,
      balance.nonCash,
      balance.username,
    ])
  }
}
