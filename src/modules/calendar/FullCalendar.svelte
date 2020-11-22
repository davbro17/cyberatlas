
<script>
  import { Calendar } from "@fullcalendar/core";
  import dayGridPlugin from '@fullcalendar/daygrid';
  import interactionPlugin from '@fullcalendar/interaction'
  //import listPlugin from '@fullcalendar/list';
  import { onMount, onDestroy } from 'svelte';
  import htmlToImage from 'html-to-image';

  export let resizeEvent;


  let calendarNode;
  let calendar;
  let unsubscribe;

  onMount(async () => {
    calendar = new Calendar(calendarNode, {
      plugins: [dayGridPlugin, interactionPlugin],
      fixedWeekCount: false,
      initialView: 'dayGridWeek',
      editable: true,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay'
      },
      events: [
      { // this object will be "parsed" into an Event Object
        title: 'The Title', // a property!
        start: '2020-10-01', // a property!
        end: '2020-10-02' // a property! ** see important note below about 'end' **
      }]
    });
    calendar.render();
    unsubscribe = resizeEvent.subscribe(() => {
      console.log("RESIZING!");
      calendar.updateSize();
    });
  });

  onDestroy(() => unsubscribe());

  function convert2Image(callback){
    htmlToImage.toPng(calendarNode)
      .then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        callback(img);
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
  }

  function exportCalendar() {
    convert2Image(img => document.body.append(img));
  }

  function printCalendar() {
    convert2Image(img => {
      var w = window.open("");
      img.style = "max-height: 100vh !important;max-width: 90% !important"
      img.onload = () => w.print();
      w.document.write(img.outerHTML).print();
    });
  }
</script>
<div class="field is-grouped">
  <button class="button is-info m-2 control" on:click={exportCalendar}>
    Export to Image
  </button>
  <button class="button is-info m-2 control" on:click={printCalendar}>
    Print Calendar
  </button>
</div>


<div bind:this={calendarNode}></div>