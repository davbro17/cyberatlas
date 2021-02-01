<template>
  <div>
    <div v-if="!self.singleton">
      <config-title
        label="Background Color"
        config="style.fillColor"
        :defaults.sync="defaults"
      />
      <color-select
        v-model="self.style.fillColor"
        :rounded="self.style.rounded"
      />
      <config-title
        label="Border Color"
        config="style.strokeColor"
        :defaults.sync="defaults"
      />
      <border-color
        :fillColor="self.style.fillColor"
        v-model="self.style.strokeColor"
        :rounded="self.style.rounded"
      />
      <config-title
        label="Rounded Border"
        config="style.rounded"
        :defaults.sync="defaults"
      />
      <div class="field">
        <b-switch
          v-model="self.style.rounded"
          type="is-info"
          true-value="1"
          false-value="0"
        >
        </b-switch>
      </div>
      <hr />
    </div>
    <!-- DEVICE STYLE -->
    <div class="field is-grouped is-grouped-centered">
      <b-field
        type="is-info"
        label="Device:"
        horizontal=""
        custom-class="is-medium"
      >
        <b-select v-model="device" size="is-medium">
          <option value="Default"> Default </option>
          <option v-for="name in self.classifiers" :value="name" :key="name">
            {{ name }}
          </option>
        </b-select>
      </b-field>
    </div>
    <config-title
      label="Device Image"
      config="device.style.shape"
      :defaults.sync="defaults"
    />
    <b-field
      style="max-width:300px; max-height: 300px; overflow:auto"
      :style="{ height: self.device.height + 1 + 'px' }"
    >
      <diagram-widget :xml="getXML" :width="getWidth" :height="getHeight" />
    </b-field>
    <device-stencil v-model="self.device.style.shape" />
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">width</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control is-expanded has-icons-left">
            <input
              class="input is-info"
              type="text"
              placeholder="10"
              v-model.number="self.device.width"
            />
          </p>
        </div>
      </div>
    </div>
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">height</label>
      </div>
      <div class="field-body">
        <div class="field">
          <p class="control is-expanded has-icons-left">
            <input
              class="input is-info"
              type="text"
              placeholder="10"
              v-model.number="self.device.height"
            />
          </p>
        </div>
      </div>
    </div>
    <config-title
      label="Device Background Color"
      config="device.background.fillColor"
      :defaults.sync="defaults"
    />
    <color-select v-model="self.device.background.fillColor" rounded />
    <config-title
      label="Device Border Color"
      config="device.background.strokeColor"
      :defaults.sync="defaults"
    />
    <border-color
      :fillColor="self.device.background.fillColor"
      v-model="self.device.background.strokeColor"
      rounded
    />
    <!-- Device Label -->
    <config-title
      label="Device Label"
      config="lines"
      :defaults.sync="defaults"
    />
    <TextEditor :self.sync="self" :data.sync="data" />
  </div>
</template>

<script>
import ConfigTitle from "../templates/ConfigTitle.vue";
import TextEditor from "./TextEditor.vue";
import ColorSelect from "../templates/ColorSelect.vue";
import BorderColor from "../templates/BorderColor.vue";
import DeviceStencil from "../templates/DeviceStencil.vue";
import DiagramWidget from "../DiagramWidget.vue";

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
    return {
      device: "Default"
    };
  },
  computed: {
    // @vuese
    // Creates XML for device preview in Style Tab
    getXML() {
      return (
        '<mxGraphModel dx="80" dy="80"><root><mxCell id="0"/><mxCell id="1" parent="0" style="fillColor=' +
        this.self.device.background.fillColor +
        ";strokeColor=" +
        this.self.device.background.strokeColor +
        ';" vertex="1"><mxGeometry x="0" y="0" width="' +
        this.self.device.width +
        '" height="' +
        this.self.device.height +
        '" as="geometry"/></mxCell>' +
        '<mxCell id="2" style="shape=' +
        this.self.device.style.shape +
        ';" parent="0" vertex="1"><mxGeometry x="0" y="0" width="' +
        this.self.device.width +
        '" height="' +
        this.self.device.height +
        '" as="geometry"/></mxCell>' +
        "</root></mxGraphModel>"
      );
    },
    // @vuese
    // Get the device width [Number] and return as String with units [px]
    getWidth() {
      return this.self.device.width.toString() + "px";
    },
    // @vuese
    // Get the device width [Number] and return as String with units [px]
    getHeight() {
      return this.self.device.height.toString() + "px";
    }
  },
  components: {
    TextEditor,
    ConfigTitle,
    BorderColor,
    ColorSelect,
    DeviceStencil,
    DiagramWidget
  },
  mounted() {
    if (!this.self.lines) {
      this.$set(this.self, "lines", []);
    }
  }
};
</script>
