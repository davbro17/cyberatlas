<script>
  import DataTable from "../components/DataTable.svelte";

  const button = function(cell, formatterParams, onRendered){ //plain text value
    return `<button class='button is-info is-small'>${formatterParams}</button>`;
  };

  const columns = [
    {title: "#", formatter:"rownum", hozAlign:"center", width:40, visibility: false},
    {title: "Task", field: "module"},
    {formatter: button, formatterParams: "INPUTS", hozAlign:"center"},
    {formatter: button, formatterParams: "CONFIG", hozAlign:"center"},
    {formatter: button, formatterParams: "OUTPUT", hozAlign:"center"}
  ]

  export let steps = [];
</script>

<h1 class="title">
  Workflow!
</h1>
<div class="field is-grouped">
  <div class="field has-addons control is-expanded">
    <div class="control is-expanded">
      <input
        class="input is-info"
        placeholder="I want to ..."
      />
    </div>
    <div class="control">
      <button class="button is-info">Add</button>
    </div>
  </div>
  <div class="control">
    <button class="button is-link">Help</button>
  </div>
</div>
<div class="field">
  <DataTable noBorders noSorting columns={columns} data={steps}/>
</div>



<style>
  .title {
    color:var(--text-secondary);
  }
</style>