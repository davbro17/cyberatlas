import pick from "lodash.pick";
import validate from "validate.js";
import dbInt from "./db.js";
import modules from "../engine/module.js"

const defaultStep = {
  module: "present",
  panes: [
    {component: "MultiPane", percent: 1, children: [
      {component: "InputManager", percent: 1},
      {component: "FullCalendar", percent: 1},
    ]},
    {component: "FullCalendar", percent: 1}
  ]
}

export default function ProjectFactory(db){
  const constraints = {
    id: {type: "integer"},
    manifest: {type: "integer", presence: true},
    input: {type: "integerArray"},
    fileID: {type: "integer", presence: true}
  };  

  function Project(args={}){
    for(const prop in constraints){
      const tmp = args[prop];
      if(tmp != undefined) this[prop] = tmp;
    }
  }

  Project.prototype.validate = function(){
    return validate(this, constraints);
  };

  Project.prototype.save = async function () {
    this.input = await this.input || [];
    if(this.fileID){
      const tmp = await pick(this, Object.keys(constraints));
      this.id = await db.projects.put(tmp);
    } else {
      console.log("Creating Project's file")
      this.file = await dbInt.addFile({name: "proj.atlas", sheets: [], type: "project"});
      this.fileID = this.file.id;
      const manifest = await this.createManifest();
      console.log(this.file);
      this.manifest = await manifest.id;
      const invalid = await this.validate();
      if(invalid){
        console.error(`Error creating project with: ${this.toString()}`);
        return Project.reject(invalid);
      } else {
        const tmp = await pick(this, Object.keys(constraints));
        this.id = await db.projects.put(tmp);
      }
    }
    return this;
  };

  Project.prototype.loadManifest = async function(){
    const id = await this.sheets.find(s => s === "manifest.json" || s === "manifest.csv");
    this.manifest = await id ? dbInt.getSheets({id: id}) : this.createManifest();
  }

  Project.prototype.createManifest = function(){
    return this.file.createSheet({name: "manifest.json", type: "tabular", data: [defaultStep]})
  }

  Project.prototype.addInput = function(id){
    this.input.push(id);
    db.projects.update(this.id, {input: this.input});
  }

  Project.prototype.initialize = async function(){
    let count = 1;
    if(!("file" in this)){
      this.file = await db.files.get({id: this.fileID})
    }
    this.activeManifest = await this.file.getSheet({id: this.manifest});
    console.log(this.activeManifest);
    this.steps = await this.activeManifest.getData("json");
    console.log(`Getting Manifest Data:\n${JSON.stringify(this.steps)}`);
    for(const step of this.steps){
      try{
        let ids = [];
        const path = await `./src/modules/${step.module}/main.js`;
        const module = await (await modules["present"]()).default;
        console.log(module);
        for(const file of module.files){
          const id = await this.file.touchSheet(`${count}_${file}`, []);
          ids.push(id);
        }
        (step.sheets = ids, count++);
      } catch(e) {
        console.error(e)
      }
    }
  }

  db.projects.mapToClass(Project);

  return Project;
}