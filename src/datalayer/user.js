import PBKDF2 from "crypto-js/pbkdf2";
import validate from "./validator.js";
import { lib as crypto } from "crypto-js";

export default function UserFactory(db){
  const constraints = {
    username: {type: "string", presence: true},
    passwordHash: {type: "string"},
    //passwordSalt: {type: "array", presence: true},
    lastLogin: {type: "integer", presence: true},
    publicKey: {type: "string"},
    secretBox: {type: "string"}
  };

  function User(args){
    console.log(args);
    for(const prop in args){
      this[prop] = args[prop];
    }
    if("password" in args){
      this.setPassword(args.password);
      delete this.password;
    }
  };

  User.prototype.validate = function(){
    return validate(this, constraints);
  };

  User.prototype.save = function () {
    const invalid = this.validate();
    console.log(this.passwordSalt);
    if(invalid){
      return Promise.reject(invalid);
    } else {
      this.creationDate = Date.now();
      return db.users.put(this);
    }
  };

  User.prototype.getPasswordHash = function(password){
    return PBKDF2(password, this.passwordSalt, {
      keySize: 512 / 32,
      iterations: 1000
    }).toString();
  }

  User.prototype.getPasswordSalt = function(){
    return this.passwordSalt || (this.passwordSalt = crypto.WordArray.random(128/8), this.passwordSalt)
  }

  User.prototype.setPassword = function(password) {
    this.passwordSalt = this.getPasswordSalt();
    this.passwordHash = this.getPasswordHash(password);
  }

  User.prototype.authenticate = function(guess){
    return this.getPasswordHash(guess) === this.passwordHash;
  }

  /* Map User constructor to Database */
  db.users.mapToClass(User);

  /* Return User constructor */
  return User;
}