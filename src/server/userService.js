import messages from './messages.js'
import bcrypt from "bcrypt";

export class UserService {
    constructor(provider){
        this.provider = provider
    }
    async getUsers(){
        return await this.provider.getUsers()
    }
    async registerUser(newUser){
        let result = await this.isUserNameExist(newUser.name)
        if(!result.success) return result
        result = await this.isUserEmailExist(newUser.email)
        if(!result.success) return result
        return this.provider.registerUser(newUser)
    }
    async isUserNameExist(name){
      if(!name) return {success: false, message: messages.INVALID_USER_DATA}
      const users = await this.getUsers()
      const user = users.find(u => u.name === name)
      if(user) return {success: false, message: messages.USER_NAME_EXIST}
      return {success: true, message: messages.USER_NAME_ALLOWED}
    }
}

export function hashData(data) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(data, 10, (err, hash) => {
        if (err) reject(err);
        else resolve(hash);
      });
    });
  }
