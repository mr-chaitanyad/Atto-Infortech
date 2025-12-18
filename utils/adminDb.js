const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const utils = require('./helper');

module.exports = Object.assign({}, {
  createSystemUser: (admin) => {
    return new Promise(async (resolve, reject) => {
      console.log('Checking system user in DB...');
      const user = await User.findOne({ email: admin.email });
      if (user) {
        console.log('System user already present! Please check config.');
        return resolve();
      } else {
        console.log('System user not found.')
        console.log('Creating System User now...');
        bcrypt.hash(admin.password, 10, async function (err, hash) {
          if (err) {
            console.log('Err in helpers bcrypt');
            return resolve();
          }
          const newUser = new User({
            name: `${admin.firstName} ${admin.lastName}`,
            email: admin.email,
            password: hash,
            encryptedKey: utils.textEncrypter(admin.password),
            mobile: admin.phone,
            status: 'active',
            type: admin.role,
            role: 1, // admin role
            success: true,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          await newUser.save((err, result) => {
            if (err) {
              console.log('Err in creating system users');
              return resolve();
            }
            console.log('System user created!');
            return resolve();
          })
        })
      }
    })
  }
})