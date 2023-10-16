import bcrypt from "bcrypt"

export const hashPwd = async (unHashPwd: string) => {
  return await bcrypt.hash(unHashPwd, 10)
}

export const comparePwd = async (unHashPwd: string, hashPwd: string) => {
  return await bcrypt.compare(unHashPwd, hashPwd)
}