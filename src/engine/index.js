import {modules} from modules.json;

const mods = {}

modules.forEach(m => mods[m] = null);

async function processManifest(name){
  
}

async function importManifest(name){
  const file = `manifest.json`;
  const manifest = await import().then(module => module.default)
  return manifest;
}

const engine = {
  mods: mods,
  async initMod(name){
    if(name in mods){
      if(!mods[name]){
        await importManifest(name);
      }
      await processManifest();
    }
  }
}
