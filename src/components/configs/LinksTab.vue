<template>
  <div>
    <p>Hello There</p>
  </div>
</template>

<script>
// import ConfigTitle from "../templates/ConfigTitle.vue";

export default {
  props: {
    configs: {
      type: Array,
      default() {
        return [];
      }
    },
    data: {
      type: Object,
      default() {
        return {
          sheets: [],
          headers: [],
          files: [],
          customHeaders: [],
          fileName: ""
        };
      }
    },
    self: {
      type: Object,
      required: true
    },
    defaults: {
      type: Object,
      default() {
        return null;
      }
    }
  },
  data() {
    return {};
  },
  methods: {},
  components: {
    // ConfigTitle
  },
  mounted() {}
};
</script>
