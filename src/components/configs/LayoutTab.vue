<template>
  <div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">padding left</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control is-expanded has-icons-left">
            <input
              class="input is-info"
              type="text"
              placeholder="10"
              v-model.number="self.padding.left"
            />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">padding top</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control is-expanded has-icons-left">
            <input
              class="input is-info"
              type="text"
              placeholder="10"
              v-model.number="self.padding.top"
            />
          </p>
        </div>
      </div>
    </div>
    <div class="field">
      <label class="label">Device Layout</label>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">columns</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control has-icons-left">
            <input
              class="input is-info"
              type="text"
              placeholder="10"
              v-model.number="self.device.columns"
            />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">padding left</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control is-expanded has-icons-left">
            <input
              class="input is-info"
              type="text"
              placeholder="10"
              v-model.number="self.device.padding.left"
            />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">padding top</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control is-expanded has-icons-left">
            <input
              class="input is-info"
              type="text"
              placeholder="10"
              v-model.number="self.device.padding.top"
            />
          </p>
        </div>
      </div>
    </div>
    <config-title
      label="Line Height"
      config="device.lineHeight"
      :defaults.sync="defaults"
    />
    <div class="field">
      <p class="control is-expanded has-icons-left">
        <input
          class="input is-info"
          type="text"
          placeholder="10"
          v-model.number="self.device.lineHeight"
        />
      </p>
    </div>
  </div>
</template>

<script>
import ConfigTitle from "../templates/ConfigTitle.vue";

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
    ConfigTitle
  },
  mounted() {}
};
</script>
