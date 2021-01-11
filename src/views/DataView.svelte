<script>
  import DataTable from "../components/DataTable.svelte";
  import db from "../datalayer/db.js";
  let selected = 4;

  const formatterParams = {
    inputFormat:"x",
    outputFormat:"DD MMM YYYY HHmm:ss:SSS z",
    invalidPlaceholder:"(invalid date)",
    timezone: "UTC"
  }

  var customMutator = function(value, data, type, params, component){
	//value - original value of the cell
	//data - the data for the row
	//type - the type of mutation occurring  (data|edit)
	//params - the mutatorParams object from the column definition
	//component - when the "type" argument is "edit", this contains the cell component for the edited cell, otherwise it is the column component for the column

	return JSON.stringify(value); //return the new value for the cell data.
}

  const views = [
    {title: "&#129497;Users", data: () => db.getUsers().then(users => [db.getGuest(), ...users]), columns: [
      {title: "ID", field: "id"},
      {title: "Name", field: "username"},
      {title: "Creation Date", field: "creationDate", formatter: "datetime", formatterParams},
      {title: "Password Hash", field: "passwordHash"},
      {title: "Password Salt", field: "passwordSalt"},
      {title: "Last Login", field: "lastLogin"},
      {title: "Public Key", field: "publicKey"},
      {title: "Secret Box", field: "secretBox"}
    ]},
    {title: "&#128106;Groups", data: db.getGroups, columns: [
      {title: "ID", field: "id"},
    ]},
    {title: "&#128161;Projects", data: async() => db.getProjectView(), columns: [
      {title: "ID", field: "id"},
      {title: "Name", field: "name"},
      {title: "Manifest", field: "manifest"},
      {title: "Input", field: "input"},
      {title: "Created By", field: "createdBy"},
      {title: "Creation Date", field: "creationDate", formatter: "datetime", formatterParams },
      {title: "Modified By", field: "modifiedBy"},
      {title: "Modified Date", field: "lastModified", formatter: "datetime", formatterParams},
    ]},
    {title: "&#128218;Files", data: db.getFiles, columns: [
      {title: "ID", field: "id"},
      {title: "Name", field: "name"},
      {title: "Upload Name", field: "originalName"},
      {title: "Sheets", field: "sheets"},
      {title: "Created By", field: "createdBy"},
      {title: "Creation Date", field: "creationDate", formatter: "datetime", formatterParams},
      {title: "Modified By", field: "modifiedBy"},
      {title: "Modified Date", field: "lastModified", formatter: "datetime", formatterParams},
      {title: "Type", field: "type"}
    ]},
    {title: "&#128196;Sheets", data: db.getSheets, columns: [
      {title: "ID", field: "id"},
      {title: "Name", field: "name"},
      {title: "Chunks", field: "chunks"},
    ]},
    {title: "&#129513;Chunks", data: db.getChunks, clear: db.clearFiles, columns: [
      {title: "ID", field: "id"},
      {title: "Type", field: "type"},
      {title: "Data", field: "data", mutator: customMutator}
    ]}
  ];

  function clearFiles(){
    db.clearFiles();
    views[selected].data().then(d => data = d);
  }

  function changeView(index){
    selected = index;
  }
  
  $: data = views[selected].data();
  
</script>
<h1 class="title"> DataBase </h1>
<div class="level">
  <div class="field has-addons level-left m-0">
    {#each views as view, i}
      <p class="control">
        <button class={`button ${selected == i ? "is-info" : ""}`} on:click={() => changeView(i)}> {@html view.title} </button>
      </p>
    {/each}
  </div>
  <div class="level-right field">
    <div class="buttons">
      <button class="is-danger button" on:click={clearFiles}>Delete Files</button>
      <button class="button is-success"> Create New User</button>
    </div>
    
  </div>
</div>


{#await data}
  <p>Loading Data :/</p>
{:then rows} 
  <DataTable data={rows} columns={views[selected].columns}/>
{/await}
  


<style>
  .title{
    color: var(--text-secondary)
  }
</style>