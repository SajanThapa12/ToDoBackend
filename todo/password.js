const mongoose = require ('mongoose')
const bcrypt = require('bcrypt');

class Password {
    static async hashPassword(plainTextPassword, hashedPassword) {
        try {
            constdoesMAtch = await bcrypt.compare(plainTextPassword, hashedPassword);
            return doesMatch;
        } catch (error) {
            throw new Error("Failed to compare passwords");
        }
    }
}
const Password = mongoose.model("Password")
module.exports = Password;