import Dexie from 'dexie';
import UserFactory from './user.js';
import FileFactory from './file.js';
import SheetFactory from './sheet.js';
import ChunkFactory from './chunk.js';
import ProjectFactory from './project.js';
import GroupFactory from './group.js';

let db = new Dexie('cyberatlas');

db.version(1).stores({
  users: '++id, &username, creationDate',
  groups: "++id, &name, creationDate, createdBy",
  chunks: '++id', // data
  sheets: '++id, name, layerID',
  files: '++id,name,ownerID,groupID,creationDate,createdBy,lastModified,modifiedBy,type' //,*tags,*attributes
});

db.on("populate", function() {
  db.table("users").add({id: 0, username: "guest", secretBox: "lol", passwordHash: "lol", passwordSalt: "lol", publicKey: "SuperLol", lastLogin: "2013-12-11 10:09:08"});
});
db.open();

/* Create Database Object Classes */
let User = UserFactory(db);
let File = FileFactory(db);
let Sheet = SheetFactory(db);
let Chunk = ChunkFactory(db);
let Project = ProjectFactory(db);
let Group = GroupFactory(db);


function getTableObjects(table) {
  return async function(ids) {
    if(ids && ids instanceof Array){
      return Promise.all(ids.map((id) => table.where("id").equals(id).first()));
    } else if(ids) {
      return await table.where("id").equals(ids).first();
    } else {
      return await table.toArray();
    }
  }
}

// Database Interface
export default {
  getUsers: async () => await db.users.toArray(),
  getGroups: async () => await db.users.toArray(),
  getProjects: async () => await db.files.where("type").equals("project").toArray(),
  getFiles: getTableObjects(db.files),
  getSheets: getTableObjects(db.sheets),
  getChunks: getTableObjects(db.chunks),
  addUser: (args) => (new User(args)).save(),
  addGroup: (args) => (new Group(args)).save(),
  addProject: (args) => (new Project(args)).save(),
  addFile: (args) => (new File(args)).save(),
  addSheet: (args) => (new Sheet(args)).save(),
  addChunk: (args) => (new Chunk(args)).save(),
  clearFiles: async () => {
    db.chunks.clear();
    db.sheets.clear();
    db.files.clear();
  },
};