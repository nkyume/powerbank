import { userFindModel } from '../models/userFindModel'
import { userViewModel } from '../models/userViewModel'
import { Users } from '../repositories/usersDAL'

const usersDb = new Users()
export async function findUser(username: string): Promise<userViewModel> {
  const foundUser = await usersDb.findByUsername(username)
  return {
    username: foundUser.username,
  }
}

export async function findUsers(
  search: string,
  limit: number,
  skip: number
): Promise<userViewModel[]> {
  const foundUsers = await usersDb.findMultiple(search, limit, skip)
  return foundUsers.map((user) => {
    return {
      username: user.username,
    }
  })
}
