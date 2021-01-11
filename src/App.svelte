<script>
  import NavBar from "./components/NavBar.svelte";
  import WorkView from "./views/WorkView.svelte";
  import DataView from "./views/DataView.svelte";
  import ProjectView from "./views/ProjectView.svelte";
  import DocsView from "./views/DocsView.svelte";
  import LoginView from "./views/LoginView.svelte";
  import SettingsView from "./views/SettingsView.svelte";
  import { onMount } from 'svelte';
  import dbInterface from "./datalayer/db";

  let views = {WorkView, DataView, ProjectView, DocsView, LoginView, SettingsView};

  let selectedView = ProjectView;

  $: showActions = selectedView === WorkView;
  
  let modal = false;

  function changeView(event){
	  selectedView = event.detail.view in views ? views[event.detail.view] : selectedView;
  }

  function openModal(event){
    console.log("HANDLING")
    modal = event.detail.modal;
    console.log(modal);
  }

  let themes = [
    "dark",
    "light",
    "solar",
  ]

  let theme = localStorage.getItem('theme')
  || (localStorage.setItem('theme', themes[0]),
    themes[0]);

  const bodyClass = document.body.classList;
  bodyClass.add(theme);

  function changeTheme(event) {
    const current = localStorage.getItem('theme');
    const next = event.detail.theme;
    const bodyClass = document.body.classList;

    bodyClass.replace(current, next);
    localStorage.setItem('theme', next);
    theme = next;
  }

  onMount(async () => {
		console.log(dbInterface.getSession().user);
	});

</script>

<NavBar on:changeView={changeView} on:openModal={openModal} showActions={showActions}/>
<main>
  <svelte:component this={selectedView}
    on:changeView={changeView}
    on:changeTheme={changeTheme}
    theme={theme}/>
</main>
<svelte:component this={modal} on:closeModal={() => modal=false}/>

<style>
@import "~bulma/css/bulma.min.css";
main {
  margin-left: 4rem;
  padding: 0rem 0.5rem;
  background-color: var(--bg-main);
  color: var(--text-main);
  height: 100%;
}
</style>