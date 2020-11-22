<script>
  import DropZone from "../../components/DropZone.svelte"
  import InputWorker from "worker-loader!./input_worker.js"
  import db from "../../datalayer/db.js"
  import DataTable from "../../components/DataTable.svelte";

  let files = [];

  function handleFiles(event){
    const {acceptedFiles, rejectedFiles} = event.detail
    console.log(acceptedFiles)
    const worker = new InputWorker();
    acceptedFiles.forEach(file => {
      worker.postMessage({file})
    })
    worker.onmessage = mesg => db.getFiles(mesg.data.file).then(f => appendFile(f));
  }

  async function appendFile(file){
    console.log(file);
    file["_children"] = await db.getSheets(file.sheets);
    console.log(file);
    files = [...files, file];
  }

  const columns = [
    {title: "Files:", field:"name"}
  ]
</script>

<DropZone disableDefaultStyles noClick on:drop={handleFiles}>
  <DataTable data={files} columns={columns} noBorders noSorting dataTree/>
  <DropZone on:drop={handleFiles} noDrag/>
</DropZone>