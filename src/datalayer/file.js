import { getUniqueName, isUniqueName, capitalizeFirstLetter } from "./utility.js";
import validate from "./validator.js";
import dbInt from "./db.js";

export default function FileFactory(db){
  const constraints = {
    id: {type: "integer"},
    name: {type: "string", presence: true, length: {minimum: 1, maximum: 250}},
    originalName: {type:"string", presence: true, length: {minimum: 1, maximum: 250}},
    ownerID: {type: "integer", presence: true},
    groupID: {type: "integer"},
    lastModified: {type: "integer"}, //Unix epoch
    modifiedBy: {type: "string", presence: true},
    creationDate: {type: "integer", presence: true}, //unix epoch
    createdBy: {type: "string", presence: true},
    type: {type: "string"},
    attributes: {type: "stringArray"}, // Encrypted, Global, Persistent
    tags: {type: "stringArray"},
    sheets: {type: "array"},
    manifest: {type: "object"}
  };

  function File(args){
    console.log(args);
    const session = args.session || {};
    for(const prop in constraints){
      const tmp = args[prop] || session[prop];
      if(tmp != undefined) this[prop] = tmp;
    }
  };

  Object.keys(constraints).forEach(k => {
    File.prototype["set" + capitalizeFirstLetter(k)] = function(val){
      this[k] = c;
      return db.files.update(this.id, {k: val});
    };
  });

  File.prototype.validate = function(){
    return validate(this, constraints);
  };

  File.prototype.save = function () {
    this.originalName = this.name;
    return this.isUniqueName(this.name)
      .then( bool => {
        if(!bool){
          const regex = /^(?<base>[^\(]*)\(?(?<count>\d+)?\)?(?<ext>\..*)$/;
          const {base, count, ext} = this.name.match(regex).groups;
          const extension = ext || "";
          return this.getUniqueName(base, extension, count);
        } else {
          return this.name;
        }
      }).then(name => {
        console.log(name);
        this.name = name;
        this.creationDate = Date.now();
        const invalid = this.validate();
        if(invalid){
          return Promise.reject(invalid);
        } else {
          console.log(this);
          return db.files.put(this)
            .then(id => {
              this.id = id;
              return this;
            });
        }
      })      
  };

  File.prototype.addSheets = function(ids) {
    const tmp = ids instanceof Array ? ids : [ids];
    console.log(this.sheets);
    this.sheets = this.sheets ? (this.sheets.push(...tmp), this.sheets) : tmp;
    return db.files.update(this.id, {sheets: this.sheets});
  }

  File.prototype.createSheet = function({name, type, data}){
    return (new dbInt.Sheet({name: name, data: data, chunks: []}).save()).then(sheet =>{
      this.addSheets(sheet.id);
      return sheet;
    });
  }

  File.prototype.getSheet = function(searchParams){
    return db.sheets.get(searchParams)
  }

  File.prototype.destroySheet = function(key, value){
    this.getSheet.then(sheet => sheet.destroy());
  }

  File.prototype.findSheet = async function(name){
    const sheets = await db.sheets.bulkGet(this.sheets)
    return sheets ? sheets.find(s => s.name === name) : undefined;
  }

  File.prototype.touchSheet = async function(name, data){
    const sheet = await this.findSheet(name);
    return sheet ? sheet.id : this.createSheet({name: name, data: data});
  }

  File.prototype.getSheets = function(){
    if(this.sheets){
      return db.sheets.bulkGet(this.sheets).then(s => s instanceof Array ? s : [s]);
    } else {
      return Promise.resolve([]);
    }
  }

  File.prototype.getUniqueName = function(base, extension, count){
    return getUniqueName(db.files, "name", base, extension, count);
  }

  File.prototype.isUniqueName = function(name){
    return isUniqueName(db.files, "name", name);
  }

  /* Map File constructor to Database */
  db.files.mapToClass(File);

  /* Return File constructore */
  return File;
}