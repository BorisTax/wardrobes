import messages from '../messages.js'


export class UserService {
  constructor(provider) {
    this.provider = provider
  }
  async getUsers() {
    return await this.provider.getUsers()
  }
  async getUser(token) {
    const tokenList = await this.getTokens()
    const userList = await this.getUsers()
    const foundToken = tokenList.find(t => t.token === token)
    const userName = foundToken && foundToken.username
    const user = userList.find(u => u.name === userName)
    return user
  }
  async getTokens() {
    return await this.provider.getTokens()
  }
  async addToken({ token, username }) {
    return await this.provider.addToken({ token, username })
  }
  async deleteToken(token) {
    return await this.provider.deleteToken(token)
  }
  async clearAllTokens() {
    return await this.provider.clearAllTokens()
  }
  async registerUser(newUser) {
    let result = await this.isUserNameExist(newUser.name)
    if (!result.success) return result
    result = await this.isUserEmailExist(newUser.email)
    if (!result.success) return result
    return this.provider.registerUser(newUser)
  }
  async isUserNameExist(name) {
    if (!name) return { success: false, message: messages.INVALID_USER_DATA }
    const users = await this.getUsers()
    const user = users.find(u => u.name === name)
    if (user) return { success: false, message: messages.USER_NAME_EXIST }
    return { success: true, message: messages.USER_NAME_ALLOWED }
  }
}


