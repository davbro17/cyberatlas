import validate from "./validator.js";

export default function ChunkFactory(db){
  const constraints = {
    data: {presence: true}, // 2D String Array, not checked for performance reasons
    type: {type: "string", presence: true}
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
      return db.chunks.put(this)
      .then(id => {
        this.id = id;
        return this});
    }
  };

  Chunk.prototype.destroy = function(){
    return db.chunks.delete(this.id);
  }

  db.chunks.mapToClass(Chunk);
  return Chunk;
}