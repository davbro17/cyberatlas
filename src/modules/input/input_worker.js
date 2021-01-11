import {handleTextFile, handleJSONFile, handleTabularFile} from "../../datalayer/utility.js"

function postMesg(func){
  return function(event){
    func(event).then( file => {postMessage({file: file})});
  }
}

onmessage = function(mesg) {

  /* Get file from message */
  const file = mesg.data.file;

  try {
    const reader = new FileReader();

    switch(file.type){
      case "text/plain":
        reader.onload = postMesg(handleTextFile(file));
        reader.readAsText(file);
        break;
      case "application/json":
        reader.onload = postMesg(handleJSONFile(file));
        reader.readAsText(file);
        break;
      default:
        reader.onload = postMesg(handleTabularFile(file));
        reader.readAsArrayBuffer(file);
    }


  } catch(error) {
    console.error(error);
    this.postMessage(error);
  }
};