import XLSX from "xlsx";
import db from "../../datalayer/db.js"

function addSheet(chunks, name){
  return db.addSheet({name: name, chunks: chunks instanceof Array ? chunks : [chunks]})
}

function addFile({sheets, name, lastModified, type}){
  return db.addFile({
    name: name,
    sheets: sheets instanceof Array ? sheets : [sheets],
    lastModified: lastModified,
    modifiedBy: "Dave",
    type: type,
    creationDate: Date.now(),
    createdBy: "Dave",
    ownerID: 0,
    groupID: 0
  })
}

function handleTextFile(file){ 
  return function(event){
    const tmp = event.target.result.split(/\r?\n/).map(row => [row]);
    db.addChunk({data: tmp})
      .then(id => addSheet(id, "Content"))
      .then(id => addFile({sheets: id, name: file.name, lastModified: file.lastModified, type: file.type}))
      .then(id => postMessage({file: id}))
      .catch(error => console.error(error));
  }
}

function parseLayer(obj, data, parent){
  let tmp = [];

  if(obj instanceof Array){
    const newParent = parent + ":[]";
    if(parent.length) tmp.push(parent);
    for(const item of obj){
      if(typeof(item) === "object"){
        parseLayer(item, data, newParent);
      } else {
        tmp.push(item);
      }
    }
  } else if (obj instanceof Object) {
    for(const key in obj){
      const item = obj[key];
      if(typeof(item) === "object" ){
        const newParent = parent.length ? parent + ":" + key : key;
        parseLayer(item, data, newParent);
      } else {
        tmp.push(`${key}=${item}`);
      }
    }
    if(parent.length && tmp.length) tmp = [parent, ...tmp];
  } else {
    tmp.push(obj)
  }
  if(tmp.length) data.unshift(tmp);
}

function handleJSONFile(file){
  return function(event){
    console.log("Parsing JSON");
    const tmp = JSON.parse(event.target.result);
    const data = [];
    if(tmp instanceof Array){
      tmp.forEach(item => parseLayer(item, data, ""));
    } else {
      parseLayer(tmp, data, "");
    }
    console.log(data);
  }
}

function handleTabularData(file){
  return function(event){
    const raw = new Uint8Array(event.target.result);
    const wb = XLSX.read(raw, { type: "array" });
    const sheetList = wb.SheetNames;
    let promises = [];
    for (const sheet of sheetList){
      const tmp = XLSX.utils.sheet_to_json(wb.Sheets[sheet], {header: 1});
      promises.push(db.addChunk({data: tmp}));
    }
    Promise.all(promises)
    .then(ids => Promise.all(ids.map((id, i) => addSheet(id, sheetList[i]))))
    .then(id => addFile({sheets: id, name: file.name, lastModified: file.lastModified, type: file.type}))
    .then(id => postMessage({file: id}))
    .catch(error => console.error(error));
  }
}

onmessage = function(mesg) {

  /* Get file from message */
  const file = mesg.data.file;

  try {
    const reader = new FileReader();

    switch(file.type){
      case "text/plain":
        reader.onload = handleTextFile(file);
        reader.readAsText(file);
        break;
      case "application/json":
        reader.onload = handleJSONFile(file);
        reader.readAsText(file);
        break;
      default:
        reader.onload = handleTabularData(file);
        reader.readAsArrayBuffer(file);
    }


  } catch(error) {
    console.error(error);
    this.postMessage(error);
  }
};