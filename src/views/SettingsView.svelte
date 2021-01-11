<script>
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
  
  let themes = [
    "dark",
    "light",
    "solar",
  ]

  export let theme = localStorage.getItem('theme')
  || (localStorage.setItem('theme', themes[0]),
      themes[0]);
  
</script>

<div class="title">
  Settings
</div>
<div class="field is-horizontal">
  <div class="field-label is-normal">
    <label class="label" for="style">Theme</label>
  </div>
  <div class="field-body">
    <div class="field has-addons" id="style">
        {#each themes as t}
          <div class="control">
            <button class={`button ${t===theme ? "is-info" : ""}`} style="text-transform:capitalize;" on:click={() => dispatch("changeTheme", {theme: t})}>{t}</button>
          </div>
        {/each}
      </div>
  </div>
</div>

<style>
  .field-label {
    flex-grow: unset;
  }
</style>