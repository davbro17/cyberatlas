import validate from "./validator.js";
import dbInt from "./db.js";
import {loaders} from "./utility.js"

export default function SheetFactory(db){
  const constraints = {
    name: {type: "string", presence: true},
    layerID: {type: "integer"},
    chunks: {type: "integerArray"},
    data: {}
  };

  function Sheet(args){
    for(const prop in constraints){
      const tmp = args[prop];
      if(tmp != undefined) this[prop] = tmp;
    }
  };

  Sheet.prototype.validate = function(){
    return validate(this, constraints);
  };

  Sheet.prototype.save = function(){
    const invalid = this.validate();
    if(invalid){
      return Promise.reject(invalid);
    } else {
      const promise = this.data
        ? (new dbInt.Chunk({data: this.data, type:"tabular"})).save()
        : Promise.resolve(false)
      delete this.data;
      return promise
        .then(chunk => {
          if(chunk) this.chunks.push(chunk.id)})
        .then(_ => db.sheets.put(this))
        .then(id => {
          this.id = id;
          console.log(this);
          return this;
        });
    }
  };

  Sheet.prototype.createChunk = async function(){
    this.chunks.push(await db.addChunk({data : [], type: "tabular"}));
    return db.sheets.update(this.id, {chunks: this.chunks});
  }

  Sheet.prototype.appendData = async function(data){
    const tmp = data instanceof Array ? data : [data];
    if (this.chunks.length == 0){
      await this.createChunk()
    }
    const lastChunk = await this.chunks[this.chunks.length-1];
    db.chunks.get(lastChunk).then( chunk =>
      db.chunks.update(lastChunk, {data: [chunk.data, ...tmp]})
    );
  }

  Sheet.prototype.destroy = function(){
    return db.transaction('rw', [db.sheets, db.chunks], async() => {
      return Promise.all(this.chunks.map(chunk => chunk.destroy())).then( _ =>
        db.sheets.delete(this.id)
      )
    });        
  }

  Sheet.prototype.getData = async function(loader){
    const loadFunc = loaders[loader] || undefined;
    const chunks = await db.chunks.bulkGet(this.chunks);
    const loadedData = await loadFunc ? chunks.map(c => loadFunc(c.type)(c.data)) : chunks.map(c => c.data);
    return loadedData[0];
  }

  /* Map Sheet constructor to Database */
  db.sheets.mapToClass(Sheet);

  /* Return Sheet constructor */
  return Sheet;
}