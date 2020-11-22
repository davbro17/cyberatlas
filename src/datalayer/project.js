//import validate from "./validator.js";
import UserFactory from "./user.js";

export default function ProjectFactory(db){

    /* Map Project constructor to Database */
    let Project = UserFactory(db);

    /* Return Project constructor */
    return Project;
}