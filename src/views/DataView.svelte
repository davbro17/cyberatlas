<script>
  import DataTable from "../components/DataTable.svelte";
  import db from "../datalayer/db.js";
  import {onMount} from "svelte";

  let data;
  let selected = 4;

  const views = [
    {title: "&#129497;Users", data: db.getUsers, columns: [
      {title: "ID", field: "id"},
      {title: "Name", field: "username"},
      {title: "Password Hash", field: "passwordHash"},
      {title: "Password Salt", field: "passwordSalt"},
      {title: "Last Login", field: "lastLogin"},
      {title: "Public Key", field: "publicKey"},
      {title: "Secret Box", field: "secretBox"}
    ]},
    {title: "&#128106;Groups", data: db.getGroups, columns: [
      {title: "ID", field: "id"},
    ]},
    {title: "&#128161;Projects", data: db.getProjects, columns: [
      {title: "ID", field: "id"},
    ]},
    {title: "&#128218;Files", data: db.getFiles, columns: [
      {title: "ID", field: "id"},
      {title: "Name", field: "name"},
      {title: "Sheets", field: "sheets"},
      {title: "Created By", field: "createdBy"},
      {title: "Creation Date", field: "creationDate"},
    ]},
    {title: "&#128196;Sheets", data: db.getSheets, columns: [
      {title: "ID", field: "id"},
      {title: "Name", field: "name"},
      {title: "Chunks", field: "chunks"},
    ]},
    {title: "&#129513;Chunks", data: db.getChunks, clear: db.clearFiles, columns: [
      {title: "ID", field: "id"},
      {title: "Data", field: "data"}
    ]}
  ];

  function clearFiles(){
    db.clearFiles();
    views[selected].data().then(d => data = d);
  }

  function changeView(index){
    selected = index;
    views[selected].data().then(d => data = d);
  }
  
  onMount(async () => {
    data = await views[selected].data();
  });
  
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


{#if data}
  <DataTable data={data} columns={views[selected].columns}/>
{/if}


<style>
  .title{
    color: var(--text-secondary)
  }
</style>