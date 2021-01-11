const { readdirSync, statSync, writeFile } = require('fs')
const { join } = require('path')

const dirs = p => readdirSync(p).filter(f => statSync(join(p, f)).isDirectory())

const mods = dirs(join(__dirname, "..", "src", "modules"));

writeFile(join(__dirname, "..", "src", "engine", "modules.json"), JSON.stringify(mods, null, "  "), function(err,data){
  if(err) console.error(`${err}\nData:${data.toString()}`);
});

return true;