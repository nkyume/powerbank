import { balanceViewModel } from '../models/balanceViewModel'
import { transactionViewModel } from '../models/transactionViewModel'
import { Balances } from '../repositories/balancesDAL'

const balances = new Balances()

export async function findBalance(username: string): Promise<balanceViewModel> {
  const result = await balances.findByUsername(username)
  return {
    cash: result.cash,
    non_cash: result.nonCash,
  }
}

export async function findTransacitons(
  username: string
): Promise<transactionViewModel[]> {
  const res = await balances.findTransactions(username)
  return res.map((transaction): transactionViewModel => {
    return {
      senderUsername: transaction.senderUsername,
      receiverUsername: transaction.receiverUsername,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date,
    }
  })
}

export async function withdraw(username: string, amount: number) {
  balances.createTransaction({
    sender: username,
    receiver: username,
    amount: amount,
    type: 'withdraw',
  })
}

export async function deposit(username: string, amount: number) {
  balances.createTransaction({
    sender: username,
    receiver: username,
    amount: amount,
    type: 'deposit',
  })
}

export async function transfer(
  username: string,
  receiver: string,
  amount: number
) {
  balances.createTransaction({
    sender: username,
    receiver: receiver,
    amount: amount,
    type: 'transfer',
  })
}

export async function bablo(username: string, amount: number) {
  balances.createTransaction({
    sender: username,
    receiver: username,
    amount: amount,
    type: 'payment',
  })
}
