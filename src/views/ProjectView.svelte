<script>
  import DataTable from "../components/DataTable.svelte"
  import { createEventDispatcher } from 'svelte'
  import dbInterface from "../datalayer/db.js"
import { identity } from "@fullcalendar/core";

  const dispatch = createEventDispatcher()

  async function openProject(event) {
    if(event.detail != 1) await console.log(event.detail.getData());
    dbInterface.getSession().project = await event.detail == 1 ? dbInterface.addProject() : new dbInterface.Project(event.detail.getData());
    console.log(dbInterface.getSession());
    dispatch("changeView", {view: "WorkView"})
  }

  const columns = [
    {title: "Name", field: "name"},
    {title: "Created By", field: "createdBy"},
    {title: "Creation Date", field: "creationDate"},
    {title: "Modified By", field: "modifiedBy"},
    {title: "Modified Date", field: "lastModified"}
  ]

  const sortCriteria = [
    {column: "lastModified", dir: "des"}
  ]

  let data = dbInterface.getProjectView()

</script>
<div class="title">
  Projects
</div>
<div class="horizontal-scroll buttons">
  <button class="button" on:click={openProject}>+ Add Project</button>
</div>
{#await data}
  Loading Data
{:then value} 
<DataTable initialSort={sortCriteria} columns={columns} data={value} selectable={1} on:doubleClick={openProject}/>
{/await}

<style>
  .title{
    color: var(--text-secondary)
  }
</style>