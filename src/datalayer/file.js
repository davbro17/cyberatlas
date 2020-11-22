import validate from "./validator.js";

export default function FileFactory(db){
    const constraints = {
        name: {type: "string", presence: true},
        ownerID: {type: "integer", presence: true},
        groupID: {type: "integer"},
        lastModified: {type: "integer"}, //Unix epoch
        modifiedBy: {type: "string", presence: true},
        creationDate: {type: "integer", presence: true}, //unix epoch
        createdBy: {type: "string", presence: true},
        type: {type: "string"},
        attributes: {type: "stringArray"}, // Encrypted, Global, Persistent
        tags: {type: "stringArray"},
        sheets: {type: "array"}
    };

    function File(args){
        for(const prop in constraints){
            this[prop] = args[prop];
        }
    };

    File.prototype.validate = function(){
        return validate(this, constraints);
    };

    File.prototype.save = function () {
        const invalid = this.validate();
        if(invalid){
            return Promise.reject(invalid);
        } else {
            return db.files.put(this);
        }
    };

    /* Map File constructor to Database */
    db.files.mapToClass(File);

    /* Return File constructore */
    return File;
}