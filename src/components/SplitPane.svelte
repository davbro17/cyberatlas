  <div style={active ? `cursor: ${cursor};userSelect:${userSelect}` : ""} class="svelte-splitter-container clearfix" on:mouseup={onMouseUp} on:mousemove={onMouseMove}>
  
    <div class={`splitter-pane splitter-paneL ${split}`} style={`${type}: ${percent}%`}>
      <slot name="paneL"></slot>
    </div>
  
    <div class={`splitter-pane-resizer ${split} ${className}`} style={`${resizeType}: ${percent}%`} on:mousedown={onMouseDown} on:click={onClick}/>
  
    <div class={`splitter-pane splitter-paneR ${split}`} style={`${type}: ${100 - percent}%`}>
      <slot name="paneR"></slot>
    </div>
    {#if active}
      <div class="svelte-splitter-container-mask"></div>
    {/if}
  </div>
  
<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let minPercent = 10;
  export let defaultPercent = 50;
  export let split = "vertical";
  export let className = "";

  let active = false;
  let hasMoved = false;
  let percent = defaultPercent;

  $: percent = defaultPercent;
  $: type = split === "vertical" ? "width" : "height";
  $: userSelect = active ? "none" : "";
  $: resizeType = split === "vertical" ? "left" : "top";
  $: cursor = active ? (split === "vertical" ? "col-resize" : "row-resize") : ""

  
  function onClick() {
    console.log("click");
    if (!hasMoved) {
      percent = 50;
      dispatch('resize', {pecent: percent});
    }
  }

  function onMouseDown() {
    active = true;
    hasMoved = false;
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
        percent = calcPercent
      }
      dispatch('resize', {percent: percent})
      hasMoved = true
    }
  }
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
  .splitter-pane.vertical.splitter-paneL {
    position: absolute;
    left: 0px;
    padding-right: 0.5em;
  }
  .splitter-pane.vertical.splitter-paneR {
    position: absolute;
    right: 0px;
    padding-left: 0.5em;
  }
  .splitter-pane.horizontal.splitter-paneL {
    position: absolute;
    top: 0px;
    width: 100%;
    padding-bottom: 0.5em;
  }
  .splitter-pane.horizontal.splitter-paneR {
    position: absolute;
    bottom: 0px;
    width: 100%;
    padding-top: 0.5em;
  }
  .splitter-pane > :global(div){
    height:100%;
  }
  .splitter-pane {
    padding: 0.25em;
    height:100%;
  }
  .splitter-pane::-webkit-scrollbar {
    width: 0.25rem;
    padding-left: 10px;
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
  </style>