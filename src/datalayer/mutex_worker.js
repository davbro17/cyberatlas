import { expose } from "threads";
import {BroadcastChannel} from "broadcast-channel";
const channel = new BroadcastChannel('cyberatlas');

const locks = {
  chunks: {},
  sheets: {},
  files: {}
}

let ownerID = 0;

function illegalAction(action, obj, id){
  console.log(`Illegal mutex action: ${
    action || "NULL"
  }; with obj ${
    obj || "NULL"
  }; with id ${id || "NULL"}`);
}



channel.onmessage = function(event){
  const action = event.data.action || null;
  const obj = "chunk" in event.data ? "chunk"
    : "sheet" in event.data ? "sheet"
    : "file" in event.data ? "file"
    : null
  const id = event.data.chunk || event.data.sheet || event.data.file || null;
  const owner = (event.data.owner && Number.isInteger(event.data.owner)) || (ownerID++, ownerID);
  if(!(action && obj && Number.isInteger(id))){
    illegalAction(action, obj, id);
    return;
  }
  let lock = locks[obj][id] || false;
  switch(action){
    case "lock":
      if(lock){
        channel.postMessage({success: false, lock: lock});
      } else {
        lock = {lastLock: Date.now(), owner: owner}
        locks[obj][id] = lock;
        channel.postMessage({success: true, lock: lock});
      }
      break;
    case "unlock":
      if(id in locks[obj]){
        delete locks[obj][id];
      } else {
        channel.postMessage({success: false, lock: false});
      }
      break;
    case "check":
      channel.postMessage({success: true, lock: lock});
      break;
    case "force":
      
      break;
    default:
      illegalAction(action, obj);
      break;
  }
}

expose({
  postMessage(){
    console.log("WORLD");
  },
  isWorker: true
});