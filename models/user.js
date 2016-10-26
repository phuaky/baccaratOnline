'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    email:
    {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
       }
    },
    username: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          msg: 'Username must be between 1 and 99 characters'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          msg: 'Password must be between 1 and 99 characters'
        }
      }
    },
    credits: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: function(createdUser, options, cb) {
        var hash = bcrypt.hashSync(createdUser.password, 10);
        createdUser.password = hash;
        cb(null, createdUser);
      }
    },
    classMethods: {
      associate: function(models) {
      }
    },
    instanceMethods: {
       validPassword: function(password) {
         // return if the password matches the hash
         return bcrypt.compareSync(password, this.password);
       },
       toJSON: function() {
         // get the user's JSON data
         var jsonUser = this.get();
         // delete the password from the JSON data, and return
         delete jsonUser.password;
         return jsonUser;
       }
     }
  });
  return user;
};
