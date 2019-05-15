const bcrypt = require('bcrypt');

const User = require('../../models/user.js');

module.exports = {
  createUser: async (args)=>{
    try {
      let user = await User.findOne({email: args.userInput.email})
      if (user) {
        throw new Error ('User Already Exist')
      }
      let hashedPassword = await bcrypt.hash(args.userInput.password,12)
      const newUser = new User({
        email: args.userInput.email,
        password: hashedPassword
      })
      let result = await newUser.save()
      console.log('resultuser',result._doc);
      return {...result.doc, _id: result._id, email:result.email, password:result.password};
    } catch (e) {
      throw err
    }
  }
}
