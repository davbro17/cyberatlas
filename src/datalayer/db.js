import Dexie from 'dexie';
import 'dexie-observable';
import UserFactory from './user.js';
import FileFactory from './file.js';
import SheetFactory from './sheet.js';
import ChunkFactory from './chunk.js';
import ProjectFactory from './project.js';
import GroupFactory from './group.js';
import Session from './session.js';
import { getTableObjects } from './utility.js';
import getGuest from './guest.js';
import pick from 'lodash.pick';
import { spawn, Worker } from "threads";
import {BroadcastChannel, createLeaderElection} from "broadcast-channel";

let db = new Dexie('cyberatlas');

db.version(1).stores({
  users: '++id, &username, creationDate, lastLogin',
  groups: "++id, &name, creationDate, createdBy",
  chunks: '++id', // data
  sheets: '++id, name, layerID',
  files: '++id,name,ownerID,groupID,creationDate,createdBy,lastModified,modifiedBy,type', //,*tags,*attributes
  projects: '++id, manifest'
});

/* https://www.npmjs.com/package/broadcast-channel */

const channel = new BroadcastChannel('cyberatlas');
const elector = createLeaderElection(channel);
elector.awaitLeadership().then(async ()=> {
  console.log('this tab is now leader');
  await spawn(new Worker("./mutex_worker.js"));
})

/* Create Database Object Classes */
const User = UserFactory(db);
const Chunk = ChunkFactory(db);
const Sheet = SheetFactory(db);
const File = FileFactory(db);
const Group = GroupFactory(db);
const Project = ProjectFactory(db);


db.on('changes', function (changes) {
  changes.forEach(function (change) {
    switch (change.type) {
      case 1: // CREATED
        console.log('An object was created in '  + change.table + ': ' + JSON.stringify(change.obj));
        break;
      case 2: // UPDATED
        console.log('An object with key ' + change.key + ' was updated with modifications: ' + JSON.stringify(change.mods));
        break;
      case 3: // DELETED
        console.log('An object was deleted: ' + JSON.stringify(change.oldObj));
        break;
    }
  });
});

db.open();

// Database Interface
export default {
  // DB Object Constructors - available for when constructing 
  // objects from data received from web workers
  Chunk: Chunk,
  Sheet: Sheet,
  File: File,
  Project: Project,
  // Get functions
  getGuest: getGuest(User),
  getUsers: getTableObjects(db.users),
  getGroups: getTableObjects(db.groups),
  getFiles: getTableObjects(db.files),
  getProjects: getTableObjects(db.projects),
  getSheets: getTableObjects(db.sheets),
  getChunks: getTableObjects(db.chunks),
  // Add Functions
  addUser: (args) => (new User(args)).save(),
  addGroup: (args) => (new Group(args)).save(),
  addProject(args){return (new Project(args)).save()},
  addFile(args){return (new File(Object.assign(args, {session: this.getSession()}))).save()},
  addSheet: (args) => (new Sheet(args)).save(),
  addChunk: (args) => (new Chunk(args)).save(),
  // Clear functions
  clearFiles: async () => {
    db.chunks.clear();
    db.sheets.clear();
    db.files.clear();
    db.projects.clear();
  },
  // Session Functions
  getSession(){return this.session || (this.session = new Session(this), this.session)},
  login(username, password){
    const tmp = new Session(this, username, password);
    if(tmp.invalid){
      return false;
    } else {
      this.session = tmp;
      return tmp;
    }
  },
  logout(){return (this.session = null, this.getSession())},
  // Views
  async getProjectView() {
    const projects = await this.getProjects();

    await Promise.all(projects.map(async proj =>{
      return this.getFiles({id: proj.fileID}).then(files => {
        const extracted = pick(files[0], ["createdBy", "creationDate", "lastModified", "modifiedBy", "name"]);
        Object.assign(proj, extracted);
      })
    }));
    console.log(projects);
    
    return projects;
  }
};