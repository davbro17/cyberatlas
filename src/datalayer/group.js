//import validate from "./validator.js";
import UserFactory from "./user.js";

export default function GroupFactory(db){

    /* Create Group class from UserFactory */
    let Group = UserFactory(db);

    /* Return Group constructor */
    return Group;
}