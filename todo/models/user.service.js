const bcrypt = require('bcrypt');
const User = require('./User');

class UserService{
    constructor() {
        this.users = [];
    }
    async registerUser(username,password) {
        const existingUser = this.users.find(u => u.username === username);
        if (existingUser) {
            throw new Error('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User(this.users.length + 1, username, hashedPassword);
        this.users.push(newUser);
        return {
            user : newUser,
            message: 'User registration successfully'
        };

    }

    async authenticateUser(username, password) {
        const  user = this.users.find(u => u.username === username);
        if (!isMatch) {
          throw new Error('Invalid username or password');
        }

        return user;
    }

    findUserById(userId) {
        return this.users.find(userId);
    }
}
module.exports = new UserService();