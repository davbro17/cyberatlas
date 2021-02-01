<template>
  <div class="column" style="padding-bottom:0em;">
    <div v-for="(conf, index) in config" :key="index">
      <component v-bind:is="'configs-' + conf._comp" ref="component" />
    </div>
  </div>
</template>

<script>
let error = {
  error: {
    _text: "Developer forget to implement tool configuration :/"
  }
};

export default {
  props: {
    config: {
      type: Array,
      default() {
        return [error];
      }
    }
  },
  components: {
    "config-steps": () => import("./ConfigSteps.vue"),
    "config-error": () => import("./ConfigError.vue")
  },
  methods: {
    process() {
      const ref = this.configs._args.name || "steps";
      let children = [];
      for (const step of this.$refs.step) {
        children.push(step.process);
      }
      return { [ref]: children };
    }
  }
};
</script>
