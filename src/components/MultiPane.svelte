  <div style={active ? `cursor: ${cursor};userSelect:${userSelect}` : ""} class="svelte-splitter-container clearfix" on:mouseup={onMouseUp} on:mousemove={onMouseMove}>
    {#each panes as p, index}
      <div class="splitter-pane" style={`${p.style || ""}${p.calcStyle || ""}`}>
        {#if p.props && 'before' in p.props && p.name !== "MultiPane"}
          <svelte:component this={p.props.before} {...(p.props.beforeProps || {})}/>
        {/if}
        <svelte:component this={p.component} {...p.props} panes={p.children || []} bind:this={p.instance}/>
        <!--
        {#if p.props && !p.props.panes}
          <div class="pane-skeleton"></div>
          <button class="button is-info swap-button">Swap</button>
        {/if}
        -->
        <slot name="after"/>
      </div>
      {#if index != panes.length -1}
        <div
          data-id={index}
          class={`splitter-pane-resizer ${split} ${className}`}
          style={`${resizeType}: ${panes[index + 1].offset}%`}
          on:mousedown={onMouseDown}
          on:click={onClick}/>
      {/if}
    {/each}
    {#if active}
      <div class="svelte-splitter-container-mask"></div>
    {/if}
    
  </div>
  
<script>
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  export let minPercent = 10;
  export let defaultPercent = 50;
  export let split = "vertical";
  export let padding = "0.5em"
  export let className = "";
  export let panes = [
    {percent: 50},
    {percent: 50}
  ]

  let active = false;
  let hasMoved = false;
  let percent = defaultPercent;
  let splitter = 0;

  $: if(panes.some(p => p.calcPercent == undefined)) {
    const sum = panes.reduce((accum, curr) => curr.percent + accum, 0);
    let offset = 0;
    panes.forEach((p, index) => {
      p.offset = offset;
      offset += p.calcPercent = Math.floor(p.percent/sum * 10000) / 100
      p.style = `${
        index != 0 
          ? paddingB + padding + ";"
          : ""
        }${
          index != panes.length - 1
            ? paddingA + padding +";"
            : ""
        }${
          split === "vertical"
            ? "height:100%;"
            : "width: 100%;"
        }`
      p.calcStyle = `${type}: ${p.calcPercent}%; ${resizeType}: ${p.offset}%`
    })
    panes = panes;
  }
  $: percent = defaultPercent;
  $: type = split === "vertical" ? "width" : "height";
  $: userSelect = active ? "none" : "";
  $: resizeType = split === "vertical" ? "left" : "top";
  $: paddingA = split === "vertical" ? "padding-right:" : "padding-bottom:";
  $: paddingB = split === "vertical" ? "padding-left:" : "padding-top:";
  $: cursor = active ? (split === "vertical" ? "col-resize" : "row-resize") : "";

  // Events

  function onClick() {
    console.log("click");
    if (!hasMoved) {
      percent = 50;
      dispatch('resize', {pecent: percent});
    }
  }

  function onMouseDown(event) {
    active = true;
    hasMoved = false;
    console.log(event.currentTarget.dataset.id);
    splitter = event.currentTarget.dataset.id;
  }
  function onMouseUp() {
    active = false;
  }
  
  function onMouseMove(e) {
    if (e.buttons === 0 || e.which === 0) {
      active = false
    }
    if (active) {
      let offset = 0
      let target = e.currentTarget
      if (split === 'vertical') {
        while (target) {
          offset += target.offsetLeft
          target = target.offsetParent
        }
      } else {
        while (target) {
          offset += target.offsetTop
          target = target.offsetParent
        }
      }
      const currentPage = split === 'vertical' ? e.pageX : e.pageY
      const targetOffset = split === 'vertical' ? e.currentTarget.offsetWidth : e.currentTarget.offsetHeight
      const calcPercent = Math.floor(((currentPage - offset) / targetOffset) * 10000) / 100
      if (calcPercent > minPercent && calcPercent < 100 - minPercent) {
        const id = Number(splitter);
        const delta = calcPercent - panes[id+ 1].offset;
        console.log(delta);
        const p =  panes[id], p1 = panes[id+1];
        p.calcPercent += delta;
        p.calcStyle = `${type}: ${p.calcPercent}%; ${resizeType}: ${p.offset}%`
        p1.calcPercent -= delta;
        p1.offset = calcPercent;
        p1.calcStyle = `${type}: ${p1.calcPercent}%; ${resizeType}: ${p1.offset}%`
        panes = panes;
      }
      dispatch('resize', {percent: calcPercent})
      hasMoved = true
    }
  }

  onMount(async () => {
      panes.forEach(p => {
        if(p.listeners && p.instance){
          console.log("Adding listeners");
          for (let [key, listener] of Object.entries(p.listeners)) {
            p.instance.$on(key, listener);
          }
      }
      })
    })
  </script>
  
  <style scoped>
  .clearfix:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
  }
  .svelte-splitter-container {
    height: 100%;
    position: relative;
  }
  .svelte-splitter-container-mask {
    z-index: 9999;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
  .splitter-pane-resizer {
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background: #000;
    position: absolute;
    opacity: .2;
    z-index: 1;
    -moz-background-clip: padding;
    -webkit-background-clip: padding;
    background-clip: padding-box;
  }
  .splitter-pane-resizer.horizontal {
    height: 11px;
    margin: -5px 0;
    border-top: 5px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: row-resize;
    width: 100%;
  }
  .splitter-pane-resizer.vertical {
    width: 11px;
    min-height: 100px;
    height: 100%;
    margin-left: -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
  }
  .splitter-pane {
    padding: 0.25em;
    position: absolute;
    overflow: auto;
  }
  .splitter-pane::-webkit-scrollbar {
    width: 0.25rem;
  }
  
  .splitter-pane::-webkit-scrollbar-track {
	  background: #1e1e24;
  }
  
  .splitter-pane::-webkit-scrollbar-thumb {
	  background: rgb(32, 156, 238);
  }
  .splitter-pane::global(*) {
    height:100%;
  }
  .pane-skeleton{
    position:absolute;
    top:0%; left:0%;
    z-index:9;
    background-color:grey;
    width:100%;
    height:100%; 
    border: 0.25em solid var(--bg-main);
  }
  .swap-button{
    position:absolute;
    top:45%;
    left: 45%;
    z-index:10;
  }
  </style>