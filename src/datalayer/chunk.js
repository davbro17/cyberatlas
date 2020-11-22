import validate from "./validator.js";

export default function ChunkFactory(db){
    const constraints = {
        data: {type: "array", presence: true} // 2D String Array, not checked for performance reasons
    };

    function Chunk(args){
        for(const prop in constraints){
            this[prop] = args[prop];
        }
    };

    Chunk.prototype.validate = function(){
        return validate(this, constraints);
    };

    Chunk.prototype.save = function () {
        const invalid = this.validate();
        if(invalid){
            return Promise.reject(invalid);
        } else {
            return db.chunks.put(this);
        }
    };
    db.chunks.mapToClass(Chunk);
    return Chunk;
}