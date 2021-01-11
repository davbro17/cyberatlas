import XLSX from "xlsx";
import db from "./db.js";
import { flatten, inflate } from 'flattenjs';

function getTableObjects(table) {
  return async function(lookupKeys) {
    const promises = lookupKeys ? [] : [table.toArray()];
    for(const key in lookupKeys){
      const ids = lookupKeys[key];
      if(ids && ids instanceof Array){
        promises.push(...(ids.map((id) => table.where(key).equals(id).first())));
      } else if(ids) {
        promises.push(table.where(key).equals(ids).toArray());
      } else {
        continue;
      }
    }
    return promises.length == 1 ? promises[0] : Promise.all(promises);
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function addSheet(chunks, name){
  return db.addSheet({name: (name || "content"), chunks: chunks instanceof Array ? chunks : [chunks]});
}

function addFile({sheets, name, lastModified, type}){
  return db.addFile({
    name: name || "UNDEFINED",
    sheets: sheets instanceof Array ? sheets : [sheets],
    lastModified: lastModified || Date.now(),
    type: type || "unknown"
  });
}

function parseJSObject(obj){
  return Object.entries(flatten(obj)).map(kv => [kv[0], kv[1].toString()]);
}

function unparseJSObject(arr){
  const parsed = inflate(arr);
  return (0 in parsed) ? Object.values(parsed) : parsed;
}

function handleTextFile(file){ 
  return function(event){
    const tmp = event.target.result.split(/\r?\n/).map(row => [row]);
    return db.addChunk({data: tmp, type: "tabular"})
      .then(chunk => addSheet(chunk.id, file.sheeName))
      .then(sheet => addFile((file.sheets = [sheet.id], file)))
      .catch(error => console.error(error));
  }
}

function handleJSONData(obj, file){
  const tmp = typeof(obj) === "string" ? JSON.parse(obj) : obj;
  let data = parseJSObject(tmp);
  return db.addChunk({data: data, type: "tabular"})
    .then(chunk => addSheet(chunk.id, "Content"))
    .then(sheet => file.built ? sheet.id : addFile((file.sheets = [sheet.id], file)))
    .catch(error => console.error(error));
}



function handleJSONFile(file){
  return function(event){
    return handleJSONData(event.target.result, file);
  }
}

function handleTabularFile(file){
  return function(event){
    const raw = new Uint8Array(event.target.result);
    const wb = XLSX.read(raw, { type: "array" });
    const sheetList = wb.SheetNames;
    let promises = [];
    for (const sheet of sheetList){
      const tmp = XLSX.utils.sheet_to_json(wb.Sheets[sheet], {header: 1});
      promises.push(db.addChunk({data: tmp, type: "tabular"}));
    }
    return Promise.all(promises)
    .then(chunks => Promise.all(chunks.map((chunk, i) => addSheet(chunk.id, sheetList[i]))))
    .then(sheets => addFile({sheets: sheets.map(s => s.id), name: file.name, lastModified: file.lastModified, type: file.type}))
    .catch(error => console.error(error));
  }
}

function getUniqueName(table, key, base, extension, count){
  let name = base || "proj";
  const ext = extension || "";
  return table.where(key).startsWith(name).toArray().then(objs => {
    const names = objs.map(f => f.name);
    let i = count || 1;
    while(names.some(n => n ===  name + "(" + i + ")"+ ext)) i++;
    return  name + "(" + i + ")"+ ext;
  });
}

function isUniqueName(table, key, name){
  return table.where(key).startsWith(name).toArray().then(objs => {
    const names = objs.map(f => f.name);
    return names.some(n => n === name) ? false : true;
  });
}

const loaders = {
  json: function(type){
    switch(type){
      case "tabular":
        return unparseJSObject;
      default:
        return undefined;
    }
  },
  tabular: function(type){
    switch(type){
      case "json":
        return parseJSObject;
      default:
        return undefined;
    }
  }
}

export {
  handleTabularFile,
  handleTextFile,
  handleJSONFile,
  handleJSONData,
  getUniqueName,
  isUniqueName,
  capitalizeFirstLetter,
  getTableObjects,
  parseJSObject,
  unparseJSObject,
  loaders
};