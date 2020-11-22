<script>
  import BreadCrumb from "./BreadCrumb.svelte"
</script>

<div class="level m-0" style="border-bottom: 2px solid black;">
  <div class="level-left">
    <BreadCrumb crumbs={[["&#128193;Inputs", "&#128208;Config", "&#128640;Output"], "Test", "Hello", "Dave"]} />
  </div>
</div>
<div class="container" style="height:100%; overflow:auto">
  <slot></slot>
</div>