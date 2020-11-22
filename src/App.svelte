<script>
  import NavBar from "./components/NavBar.svelte";
  import WorkView from "./views/WorkView.svelte";
  import DataView from "./views/DataView.svelte";
  import ProjectView from "./views/ProjectView.svelte";
  import DocsView from "./views/DocsView.svelte";

  let options = {WorkView, DataView, ProjectView, DocsView};

  let selected = WorkView;

  function changeView(event){
	  selected = event.detail.view in options ? options[event.detail.view] : selected;
  }

</script>

<NavBar on:changeView={changeView}/>
<main>
  <svelte:component this={selected} on:changeView={changeView}/>
</main>

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