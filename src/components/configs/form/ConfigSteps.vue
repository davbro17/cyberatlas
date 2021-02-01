<template>
  <section>
    <b-steps type="is-info">
      <b-step-item
        v-for="(step, index) in config.step"
        :key="index"
        :label="step.label"
        :icon="step.icon"
      >
        <config-form
          :config="step"
          :input="input"
          :update="update"
          :inspect="inspect"
          ref="step"
        />
      </b-step-item>
    </b-steps>
  </section>
</template>
<script>
export default {
  props: {
    config: {
      type: Object,
      default() {
        return {};
      }
    },
    input: {
      type: Object,
      default() {
        return {};
      }
    },
    update: {
      type: Function,
      required: true
    },
    inspect: {
      type: Function,
      required: true
    }
  },
  components: {
    "config-form": () => import("./ConfigForm.vue")
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
