type transactionCreateModel = {
  sender: string
  receiver: string
  amount: number
  type: transaction
}

type transaction = 'withdraw' | 'deposit' | 'transfer' | 'payment'
