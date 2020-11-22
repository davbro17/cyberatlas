<script>
  let slots;
  export let tooltip = false;
  export let crumbs;
</script>

<nav aria-label="breadcrumbs">
  <ul class="cy-breadcrumb">
    {#each crumbs as c, i}
      <li>
        {#if c instanceof Array}
          <div class="select is-size-6">
            <select class="button is-text p-0 is-arrowless">
              {#each c as opt }
                <option>{@html opt}</option>
              {/each}
            </select>
          </div>
        {:else}
          <button class="is-text button p-0">{c}</button>
        {/if}
      </li>
      {#if i != (crumbs.length-1)}
        <span class="button is-text p-0">/&nbsp;</span>
      {:else}
        <span class="button is-text p-0">&#10094;</span>
        <span class="button is-text p-0">&#10095;</span>
      {/if}    
      {#if tooltip}
        <div class="tooltip">Hover over me
          <span class="tooltiptext">Tooltip text</span>
        </div>
      {/if}
      
    {/each}
    
  </ul>
</nav>
<style>
  ul.cy-breadcrumb {
    list-style: none;
  }
  ul.cy-breadcrumb li {
    display: inline;
    font-size: 18px;
  }
  ul.cy-breadcrumb span {
    color: black;
    text-decoration: none;
  }
  ul.cy-breadcrumb li button, ul.cy-breadcrumb li div select{
    color: #0275d8;
    text-decoration: none;
  }
  .select::after{
    content: none !important;
  }
  ul.cy-breadcrumb li button:hover, ul.cy-breadcrumb li div select:hover {
    color: #01447e;
    text-decoration: underline;
  }
</style>