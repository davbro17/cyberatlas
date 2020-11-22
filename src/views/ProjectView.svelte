<script>
  import DataTable from "../components/DataTable.svelte"
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()


</script>
<div class="title">
  Projects
</div>
<div class="horizontal-scroll buttons">
  <button class="button" on:click={() => dispatch("changeView", {view: "WorkView"})}>+ Add Project</button>
</div>
<DataTable />
<style>
  .title{
    color: var(--text-secondary)
  }
</style>