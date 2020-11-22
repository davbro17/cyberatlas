<script>
  import Tabulator from "tabulator-tables";
  import isEqual from 'lodash.isequal';
  import { onMount } from 'svelte';

  let table, tabulator;
  export let noBorders = false;
  export let noSorting = false;
  export let dataTree = false;

  var rowMenu = [
  {
      label:"<i class='fas fa-user'></i> Change Name",
      action:function(e, row){
          row.update({name:"Steve Bobberson"});
      }
  },
  {
      label:"<i class='fas fa-check-square'></i> Select Row",
      action:function(e, row){
          row.select();
      }
  },
  {
      separator:true,
  },
  {
      label:"<i class='fas fa-trash'></i> Delete Row",
      action:function(e, row){
          row.delete();
      }
  },
]

  export let columns = [
      {rowHandle:true, formatter:"handle", headerSort:false, frozen:true, width:30, minWidth:30},
      { title: "Name", field: "name", width: 150, editor: true },
      { title: "Age", field: "age", hozAlign: "left", formatter: "progress" },
      { title: "Favourite Color", field: "col" },
      { title: "Date Of Birth", field: "dob", hozAlign: "center", editor: true },
      {
      title: "Rating",
      field: "rating",
      hozAlign: "center",
      formatter: "star",
      editor: true
      },
      {
      title: "Passed?",
      field: "passed",
      hozAlign: "center",
      formatter: "tickCross",
      editor: true
      }
  ];

  let tableColumns = columns;

  $: {
    if(tableColumns != columns) {
      tableColumns = columns;
      tabulator.setColumns(columns);
    }
  }

  export let autoColumns = false;


  export let data = [
        { id: 1, name: "Oli Bob", age: "12", col: "red", dob: "" },
        { id: 2, name: "Mary May", age: "1", col: "blue", dob: "14/05/1982" },
        {
          id: 3,
          name: "Christine Lobowski",
          age: "42",
          col: "green",
          dob: "22/05/1982",
          rating: "4",
          passed: true
        },
        {
          id: 4,
          name: "Brendon Philips",
          age: "125",
          col: "orange",
          dob: "01/08/1980"
        },
        {
          id: 5,
          name: "Margret Marmajuke",
          age: "16",
          col: "yellow",
          dob: "31/01/1999"
        }
      ]; //data for table to display

    let tableData = data;

    $: {
      if(!isEqual(tableData, data)) {
        tableData.splice(0, tableData.length);
        tableData.push(...data);
        tabulator.redraw(true);
      }
    }

    onMount(async () => {
      tabulator = new Tabulator(table, {
        data: tableData, //link data to table
        reactiveData: true, //enable data reactivity
        movableRows:false,
        rowContextMenu: rowMenu, //add context menu to rows
        autoColumns: autoColumns,
        layout:"fitDataStretch",
        maxHeight: "80%",
        maxWidth: "95%",
        dataTree: dataTree,
        headerSort: !noSorting,
        columns: autoColumns ? [] : tableColumns, //define table columns
        dataChanged: function(data) {
          console.log(data);
        }
    });
    });
</script>

<div class="field" style="height:100%">
  <div bind:this={table} class={`tabulator is-striped ${noBorders ? "" : "is-bordered"}`} />
</div>


<style>
  @import "~tabulator-tables/dist/css/bulma/tabulator_bulma.min.css";

  .tabulator :global(div.tabulator-tableHolder::-webkit-scrollbar){
    width:0.25em;
    color: rgb(32, 156, 238);
  }
  .tabulator :global(div.tabulator-tableHolder::-webkit-scrollbar-track)
  {
    background: var(--bg-primary);
  }
  .tabulator :global(div.tabulator-tableHolder::-webkit-scrollbar-thumb){
    background: rgb(32, 156, 238);
  }
</style>