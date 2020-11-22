
<script>
  import DataTable from "../components/DataTable.svelte";
  import TaskList from "../components/TaskList.svelte";
  import FullCalendar from "../modules/calendar/fullcalendar.svelte";
  import {listView} from "../store/AppOptions";
  import SplitPane from "../components/SplitPane.svelte";
  import InputManager from "../modules/input/InputManager.svelte";
  import WorkBox from "../components/WorkBox.svelte"

  import { writable } from 'svelte/store';

  let textarea;

  export const resizeEvent = writable(false);

  function resize(){
    resizeEvent.update(moving => !moving)
  }

  function inputJSON(){
    console.log(JSON.stringify(textarea.value));
  }



</script>
{#if !$listView}
  <TaskList/>
{:else}
<SplitPane on:resize={resize}>
  <section slot="paneL">
    <WorkBox>
      <InputManager/>
    </WorkBox>
  </section>
  <section slot="paneR">
    <FullCalendar resizeEvent={resizeEvent}/>
  </section>
</SplitPane>


{/if}
