import validate from "./validator.js";

export default function SheetFactory(db){
    const constraints = {
        name: {type: "string", presence: true},
        layerID: {type: "integer"},
        chunks: {type: "integerArray"}
    };

    function Sheet(args){
        for(const prop in constraints){
            this[prop] = args[prop];
        }
    };

    Sheet.prototype.validate = function(){
        return validate(this, constraints);
    };

    Sheet.prototype.save = function () {
        const invalid = this.validate();
        if(invalid){
            return Promise.reject(invalid);
        } else {
            return db.sheets.put(this);
        }
    };

    /* Map Sheet constructor to Database */
    db.sheets.mapToClass(Sheet);

    /* Return Sheet constructor */
    return Sheet;
}