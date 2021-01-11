<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function close(){
    dispatch("closeModal");
  }
</script>

<div class="modal is-active">
  <div class="modal-background" on:click={close}></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title"><slot name="title"></slot></p>
      <button class="delete" aria-label="close" on:click={close}></button>
    </header>
    <section class="modal-card-body">
      <slot></slot>
    </section>
    <footer class="modal-card-foot">
      <slot name="footer"/>
    </footer>
  </div>
</div>