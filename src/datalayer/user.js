import PBKDF2 from "crypto-js/pbkdf2";
import validate from "./validator.js";
import { lib as crypto } from "crypto-js";

export default function UserFactory(db){
    const constraints = {
        username: {type: "string", presence: true},
        passwordHash: {type: "string", presence: true},
        passwordSalt: {type: "string", presence: true},
        lastLogin: {datetime: true},
        publicKey: {type: "string"},
        secretBox: {type: "string"}
    };

    function User(args){
        console.log(args);
        if("password" in args){
            this.setPassword(args.password);
            delete args.password;
        }
        for(const prop in constraints){
            this[prop] = args[prop];
        }
    };

    User.prototype.validate = function(){
        return validate(this, constraints);
    };

    User.prototype.save = function () {
        const invalid = this.validate();
        console.log(invalid);
        if(invalid){
            return Promise.reject(invalid);
        } else {
            return db.users.put(this);
        }
    };

    User.prototype.setPassword = function(password) {
        this.salt = crypto.WordArray.random(128/8);
        this.passwordHash = PBKDF2.compute(password, this.salt, {
            keySize: 512 / 32,
            iterations: 1000
        }).toString();
    }

    /* Map User constructor to Database */
    db.users.mapToClass(User);

    /* Return User constructor */
    return User;
}