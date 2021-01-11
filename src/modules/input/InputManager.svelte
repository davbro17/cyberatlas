<script>
  import DropZone from "../../components/DropZone.svelte"
  import InputWorker from "worker-loader!./input_worker.js"
  import db from "../../datalayer/db.js"
  import DataTable from "../../components/DataTable.svelte";
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  export let files;

  let fileTree;

  $: if(files) {
    files.subscribe(fs => {
      console.log(fs);
      const tmp = fs.map(f => Object.assign({}, f));
      Promise.all(tmp.map(async f => (f._children = await db.getSheets({id: f.sheets}), f) ))
      .then(results => fileTree = results)
    })
    
  }

  function handleFiles(event){
    const {acceptedFiles, rejectedFiles} = event.detail
    console.log(acceptedFiles)
    const worker = new InputWorker();
    acceptedFiles.forEach(file => {
      worker.postMessage({file})
    })
    worker.onmessage = mesg => appendFile(mesg.data.file);
  }

  async function appendFile(file){
    files.update(fs => [...fs, file]);
    dispatch("newFile", file.id);
  }

  const columns = [
    {title: "Files:", field:"name"}
  ]
</script>

<DropZone disableDefaultStyles noClick on:drop={handleFiles}>
  <DataTable data={fileTree} selectable={1} columns={columns} noBorders noSorting dataTree/>
  <DropZone on:drop={handleFiles} noDrag/>
</DropZone>