<template>
  <TemplateConfig :self.sync="self" autosizing :defaults.sync="defaults">
    <!-- Data Tab -->
    <template #data>
      <div v-if="!self.singleton" class="field">
        <config-title
          label="Object Label"
          config="label"
          :defaults.sync="defaults"
        />
        <div class="field">
          <input
            class="input is-info"
            type="text"
            placeholder="none"
            v-model="self.label"
          />
        </div>
      </div>
      <hr />
      <!-- SINGLETON: Conditional Render -->
      <div v-if="self.singleton">
        <config-title
          label="Conditional Render"
          config="commands"
          :defaults.sync="defaults"
        >
          <template #extra>
            <div class="buttons is-grouped">
              <button class="button is-info is-outlined" @click="addCommand">
                <b-icon icon="plus" />
                <span> Add </span>
              </button>
              <button class="button is-danger is-outlined" @click="addCommand">
                <b-icon icon="times" />
                <span> Remove </span>
              </button>
            </div>
          </template>
        </config-title>
      </div>
      <div v-else>
        <config-title
          label="Network Devices"
          config="commands"
          :defaults.sync="defaults"
        >
          <template #extra>
            <div class="buttons is-grouped">
              <button class="button is-info is-outlined" @click="addCommand">
                <b-icon icon="plus" />
                <span> Add </span>
              </button>
              <button class="button is-danger is-outlined" @click="addCommand">
                <b-icon icon="times" />
                <span> Remove </span>
              </button>
            </div>
          </template>
        </config-title>
      </div>
      <div
        class="field has-addons"
        v-for="(command, index) in self.commands"
        v-bind:key="index"
      >
        <div class="control">
          <div class="select is-info">
            <select v-model="self.commands[index].action">
              <option value="Filter">Filter</option>
              <option v-if="!self.singleton" value="Exclude">Exclude</option>
              <option v-if="!self.singleton" value="Create">Create</option>
            </select>
          </div>
        </div>
        <div class="control">
          <input
            class="input is-info"
            type="text"
            :placeholder="self.singleton ? '192.168.0.1' : '192.168.0.0/24'"
            v-model="self.commands[index].cidr"
          />
        </div>
        <div class="control">
          <a class="button is-active">
            From
          </a>
        </div>
        <div class="control">
          <input
            class="input is-info"
            type="text"
            placeholder="Sheet"
            v-model="self.commands[index].sheet"
            :disabled="command.action !== 'Filter'"
          />
        </div>
        <div class="control">
          <input
            class="input is-info"
            type="text"
            placeholder="Column"
            v-model="self.commands[index].column"
            :disabled="command.action !== 'Filter'"
          />
        </div>
        <div class="control">
          <button
            class="button is-danger is-outlined"
            @click="deleteCommand(index)"
          >
            <b-icon icon="times" />
          </button>
        </div>
      </div>
      <config-title
        label="Render If Empty"
        config="renderEmpty"
        :defaults.sync="defaults"
        v-if="!self.singleton"
      >
        <template #extra>
          <b-checkbox type="is-info" v-model="self.renderEmpty" />
        </template>
      </config-title>
      <hr />
      <!-- Classifiers -->
      <config-title
        label="Classifiers"
        config="classifiers"
        :defaults.sync="defaults"
      >
        <template #extra>
          <div class="buttons is-grouped">
            <button class="button is-info is-outlined" @click="addCommand">
              <b-icon icon="plus" />
              <span> Add </span>
            </button>
            <button class="button is-danger is-outlined" @click="addCommand">
              <b-icon icon="times" />
              <span> Remove </span>
            </button>
          </div>
        </template>
      </config-title>
      <b-field grouped>
        <b-checkbox
          type="is-info"
          :style="
            classifierOpen
              ? {
                  'vertical-align': 'top',
                  'align-items': 'normal',
                  'padding-top': '1.25em'
                }
              : {
                  'vertical-align': 'middle',
                  'align-items': 'center',
                  'padding-top': '0em'
                }
          "
        />
        <div class="card" style="width:100%">
          <div class="card-header" @click="classifierOpen = !classifierOpen">
            <a class="card-header-title">
              <div class="control" @click.stop>
                <input class="input" />
              </div>
            </a>
            <a class="card-header-icon has-text-black">
              <button
                v-if="classifierOpen"
                class="button is-info is-outlined is-small"
                style="margin-right:10px"
                @click.stop
              >
                <b-icon icon="plus" />
              </button>
              <button
                v-if="classifierOpen"
                class="button is-danger is-outlined is-small"
                style="margin-right:10px"
                @click.stop
              >
                <b-icon icon="times" />
              </button>
              <button
                v-if="classifierOpen"
                class="button is-dark is-outlined is-small"
                style="margin-right:10px"
                @click.stop
              >
                <b-icon icon="arrows-alt" />
              </button>
              Conditions
              <b-icon
                type="is-dark"
                :icon="classifierOpen ? 'angle-down' : 'angle-up'"
                style="padding-left:10px"
              >
              </b-icon>
            </a>
          </div>
          <div class="card-content" v-if="classifierOpen">
            <div
              style="margin-right:0px"
              class="field has-addons"
              v-for="(command, index) in self.commands"
              v-bind:key="index"
            >
              <div class="control" style="padding-top:0.25em; margin-left:-0.5em;margin-right:0.5em;">
                <b-icon icon="th" size="is-small" style="vertical-align:middle" />
              </div>
              
              <div class="control">
                <a class="button is-dark is-outlined">
                  <b-icon icon="angle-double-down" />
                  <span>1</span>
                </a>
              </div>
              <div class="control">
                <div class="select is-info">
                  <select>
                    <option>Value</option>
                    <option value="Row">Row</option>
                    <option value="Header">Header</option>
                    <option value="Sheet">Sheet</option>
                    <option value="AND">AND</option>
                    <option value="OR">OR</option>
                    <option value="NOT">NOT</option>
                    <option value="NEST">( NEST )</option>
                  </select>
                </div>
              </div>
              <div class="control">
                <div class="select is-info">
                  <select>
                    <option value="Equals" selected>Equals</option>
                    <option value="Contains">Contains</option>
                    <option value="Within">Within</option>
                  </select>
                </div>
              </div>
              <div class="control">
                <input
                  class="input is-info"
                  type="text"
                  :placeholder="
                    self.singleton ? '192.168.0.1' : '192.168.0.0/24'
                  "
                  v-model="self.commands[index].cidr"
                />
              </div>
              <div class="control">
                <div class="select is-info">
                  <select>
                    <option value=">" selected>&gt;</option>
                    <option value="==">==</option>
                    <option value="<">&lt;</option>
                    <option value="≥">≥</option>
                    <option value="≤">≤</option>
                  </select>
                </div>
              </div>
              <div class="control">
                <input class="input is-info" type="text" placeholder="1" />
              </div>
              <div class="control">
                <a class="button is-dark is-outlined">
                  <b-icon icon="angle-down" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </b-field>
    </template>
    <!-- Style Tab -->
    <template #style>
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
    </template>
    <!-- Layout Tab -->
    <template #layout>
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
      <div class="field is-horizontal">
        <div class="field-label is-normal">
          <label class="label">line height</label>
        </div>
        <div class="field-body">
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
      </div>
    </template>
  </TemplateConfig>
</template>

<script>
import TemplateConfig from "./TemplateConfig.vue";
import TextEditor from "./TextEditor.vue";
import ConfigTitle from "../templates/ConfigTitle.vue";
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
      command: {
        action: "Filter",
        cidr: "",
        sheet: "",
        column: "",
        id: null
      },
      device: "Default",
      classifierOpen: false
    };
  },
  methods: {
    addCommand() {
      if (!this.self.commands) {
        this.$set(this.self, "commands", []);
      }
      let tmp = Object.assign({}, this.command);
      tmp.id = this.self.id;
      this.self.commands.unshift(tmp);
    },
    deleteCommand(index) {
      this.self.commands.splice(index, 1);
    }
  },
  components: {
    TemplateConfig,
    TextEditor,
    ConfigTitle,
    BorderColor,
    ColorSelect,
    DeviceStencil,
    DiagramWidget
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
  mounted() {
    if (!this.self.lines) {
      this.$set(this.self, "lines", []);
    }
    this.command.id = this.self.id;
  }
};
</script>
<style scoped>
::v-deep .input:active {
  border-color: #167df0;
}
::v-deep .input:focus {
  border-color: #167df0;
}
::v-deep .input:hover {
  border-color: #167df0;
}
::v-deep .input {
  border-color: #167df0;
}
::v-deep .button.is-active {
  border-color: #167df0;
}
::v-deep .field.has-addons .control:first-child .control .input {
  border-bottom-right-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-left-radius: 0px;
}
</style>
