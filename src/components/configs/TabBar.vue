<template>
  <div class="column is-full-width">
    <div class="tabs is-boxed">
      <ul>
        <li
          v-for="(tab, index) in tabs"
          class="is-info"
          :class="{ 'is-active': value == index }"
          :key="index"
          @click="selectTab(index)"
        >
          <a>
            <b-icon :type="{ 'is-info': value == index }" :icon="tab.icon" />
            <span>{{ tab.name }}</span>
          </a>
        </li>
      </ul>
    </div>
    <div
      ref="tabContent"
      style="max-height:413px;overflow:auto;padding-right:15px"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      required: true
    },
    value: {
      type: Number,
      default: 0
    }
  },
  methods: {
    // @vuese
    // User selected tab at index: Number, execute v-model functionality
    //  and scroll up if tab is current tab
    selectTab(index) {
      if (this.value == index) {
        this.$refs.tabContent.scrollTop = 0;
      } else {
        this.$emit("input", index);
      }
    }
  }
};
</script>

<style scoped>
::v-deep .tabs li.is-active a {
  color: #167df0;
}
</style>
