<template>
  <div
    class="column"
    ref="widget"
    v-bind:class="widthClass"
    style="padding: 1em 0.5em 0em .5em"
  >
    <article class="panel">
      <!-- Panel Header -->
      <div class="panel-heading pointer" @click="isOpen = !isOpen">
        <div class="level">
          <div class="level-left">
            <!-- Normal Title Slot-->
            <div class="level-item">
              <strong><slot name="title"/></strong>
            </div>
            <!-- Dynamic Title Slot -->
            <slot name="dynamicTitle" />
          </div>
          <!-- Toggle Open Icon -->
          <div class="level-right">
            <div class="level-item">
              <b-icon
                :icon="isOpen ? 'angle-down' : 'angle-up'"
                size="is-small"
              >
              </b-icon>
            </div>
          </div>
        </div>
      </div>
      <!-- Panel Body -->
      <div class="panel-body" v-show="isOpen">
        <slot name="content" />
      </div>
    </article>
  </div>
</template>

<script>
export default {
  props: {
    widthClass: {
      type: String,
      default: "is-full"
    },
    Open: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isOpen: true
    };
  },
  watch: {
    // @vuese
    // Monitor the isOpen Boolean and emit events for parent components
    isOpen() {
      // Check if the panel is Open, yes -> emit "opened" event, else emit "closed" event
      this.$emit("toggle", this.isOpen);
    },
    Open() {
      this.isOpen = this.Open;
    }
  },
  mounted() {
    this.isOpen = this.Open;
  }
};
</script>
