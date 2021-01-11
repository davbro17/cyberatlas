
<script>
  import FullCalendar from "../modules/calendar/FullCalendar.svelte";
  import {listView} from "../store/AppOptions";
  import InputManager from "../modules/input/InputManager.svelte";
  import { writable } from 'svelte/store';
  import dbInterface from "../datalayer/db";
  import { onMount } from "svelte";
  import MultiPane from "../components/MultiPane.svelte";
  import AutomateView from "./AutomateView.svelte";
  import BreadCrumb from "../components/BreadCrumb.svelte"

  let project, config;
  let input = writable([]);

  export const resizeEvent = writable(false);

  function resize(){
    resizeEvent.update(moving => !moving)
  }

  function handleNewFile(event){
    console.log("NEW FILE");
    project.addInput(event.detail);
  }

  onMount( async() => {
    await console.log("mounting");
    project = await dbInterface.getSession().getProject();
    if(project.input.length){
      const files = await dbInterface.getFiles({id: project.input});
      input.set(Array.isArray(files) ? files : [files]);
    }
    await project.initialize();
    console.log("Printing Config");
    console.log(project.steps);
    const tmp = await JSON.parse(JSON.stringify(project.steps[0].panes))
    await parsePanes(tmp);
    panes = tmp;
    console.log(tmp);
  });
  
  const components = {MultiPane, InputManager, FullCalendar};
  const listeners = {newFile: handleNewFile};
  const props = {files: input, resizeEvent: resizeEvent, before: BreadCrumb,
    beforeProps: {crumbs: [["&#128193;Inputs", "&#128208;Config", "&#128640;Output"], "Test", "Hello", "Dave"]}};

  function parsePanes(root){
    for(const pane of root){
      pane.component = pane.component ? components[pane.component] : InputManager;
      pane.percent = pane.percent || 1;
      pane.listeners = listeners;
      pane.props = props;
      if("children" in pane && pane.children instanceof Array){
        parsePanes(pane.children);
      }
    }
  }


  let panes = [
    {component: MultiPane, percent: 1, children: [
      {component: InputManager, percent: 1, props: {files: input}, listeners: {newFile: handleNewFile}},
      {component: InputManager, percent: 1, props: {files: input}, listeners: {newFile: handleNewFile}},
    ]},
    {component: FullCalendar, percent: 1, props: {resizeEvent: resizeEvent}}
  ]

</script>
{#if !$listView}
  <AutomateView steps={project.steps || []}/>
{:else}
<MultiPane on:resize={resize} panes={panes} split={"horizontal"}/>
{/if}
