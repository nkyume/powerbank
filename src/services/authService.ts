import { compare, hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

import { userCreateModel } from '../models/userCreateModel'
import { userLoginModel } from '../models/userLoginModel'
import { Users } from '../repositories/usersDAL'
import { SETTINGS } from '../settings'

const usersDb = new Users()
export async function createUser(user: userCreateModel) {
  usersDb.create({
    username: user.username,
    hashed_password: await hash(user.password, 10),
  })
}

export async function loginUser(
  user: userLoginModel
): Promise<string | undefined> {
  const foundUser = await usersDb.findByUsername(user.username)
  if (!foundUser.username) {
    return undefined
  }
  if (!compare(user.password, foundUser.hashed_password)) {
    return undefined
  }
  return jwt.sign({ username: foundUser.username }, SETTINGS.JWT_SECRET, {
    expiresIn: '40m',
  })
}
