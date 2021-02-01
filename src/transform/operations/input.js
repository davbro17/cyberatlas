import { Dexie } from "dexie";

var db = new Dexie("CyberAtlasDB");
db.version(1).stores({
  files: "id++, name, type, lastModified",
  chunks: "id++, fileID, data"
});

function chunk_data(JSONString, fileID) {
  db.chunks.add({
    fileID: fileID,
    data: JSONString
  });
}

export default function process_files(fileList, currencyParams) {}
