<template>
  <div id="app">
    <!-- Main Application -->
    <div class="columns is-multiline add-space">
      <!-- Data Widget -->
      <PanelBlock
        @toggle="bool => (dataOpen = bool)"
        :widthClass="configOpen && dataOpen ? 'is-half' : 'is-full'"
      >
        <template #title>
          Step 1: Upload Scan File
        </template>
        <template #content>
          <DataWidget :data.sync="data" :actions="actions" />
        </template>
      </PanelBlock>
      <!-- Configuration Widget -->
      <PanelBlock widthClass="" @toggle="bool => (configOpen = bool)">
        <template #title>
          Step 2: Filter Data and Configure Diagram
        </template>
        <template #content>
          <ConfigWidget v-bind.sync="settings" :data="data" />
        </template>
      </PanelBlock>
      <!-- Preview Widget -->
      <PanelBlock>
        <template #dynamicTitle>
          <div class="level-item">
            <strong>Step 3:</strong>
          </div>
          <!-- PREVIEW Button -->
          <div class="level-item">
            <a class="button is-info is-outlined" @click.stop="preview">
              <span><strong>Preview</strong></span>
              <b-icon
                icon="sync"
                size="is-small"
                :custom-class="previewLoading ? 'fa-spin' : ''"
              />
            </a>
          </div>
          <div class="level-item">
            <strong>and</strong>
          </div>
          <!-- GENERATE Button -->
          <div class="level-item">
            <a class="button is-info is-outlined" @click.stop="generateDiagram">
              <span><strong>Generate Diagram</strong></span>
              <b-icon
                icon="external-link-alt"
                size="is-small"
                :custom-class="generateLoading ? 'fa-spin' : ''"
              />
            </a>
          </div>
          <div class="level-item">
            <strong>in</strong>
          </div>
          <div class="level-item" @click.stop>
            <span>
              <b-dropdown aria-role="list" v-model="settings.selected">
                <button class="button is-info is-outlined" slot="trigger">
                  <span
                    ><strong>{{ settings.selected }}</strong>
                  </span>
                  <b-icon icon="caret-down"></b-icon>
                </button>
                <b-dropdown-item
                  aria-role="listitem"
                  v-for="(item, index) in settings.openWithOptions.filter(
                    (e, i) => e != settings.selected
                  )"
                  :key="index"
                  :value="item"
                >
                  {{ item }}
                </b-dropdown-item>
              </b-dropdown>
            </span>
          </div>
        </template>
        <template #content>
          <!-- Loading Data -->
          <PreviewWidget :input="output" :configs="settings.configs" />
        </template>
      </PanelBlock>
    </div>
  </div>
</template>

<script>
import ConfigWidget from "../components/ConfigWidget.vue";
import DataWidget from "../components/DataWidget.vue";
import PreviewWidget from "../components/PreviewWidget.vue";
import PanelBlock from "../components/templates/PanelBlock.vue";
import * as MapWorker from "worker-loader!../transform/workers/map_worker";
import options from "../transform/defaults/configs.js";
import defaultLayout from "../transform/defaults/layout.js";

export default {
  name: "Map",
  props: {
    actions: {
      type: Object,
      default() {
        return {};
      }
    },
    input1: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    }
  },
  components: {
    DataWidget,
    ConfigWidget,
    PreviewWidget,
    PanelBlock
  },
  data() {
    return {
      settings: {
        configs: [],
        defaults: options,
        tracker: {},
        layout: defaultLayout,
        openWithOptions: ["Draw", "Interact"],
        selected: "Draw"
      },
      data: {
        sheets: [],
        headers: [],
        customHeaders: [],
        sheetIndex: 0,
        fileName: "",
        files: []
      },
      configOpen: true,
      dataOpen: true,
      myWorker: null,
      output: this.map.xml,
      previewLoading: false,
      generateLoading: false
    };
  },
  methods: {
    // @vuese
    // Generates a new diagram in a new tab with Drawio
    generateDiagram: function() {
      this.generateLoading = true;
      this.myWorker.postMessage([this.settings, this.data, "generate"]);
    },
    // @vuese
    // Receive result XML from Web Worker and update GUI
    receiveXML(result) {
      this.output = result.data[1];
      this.$set(this.map, "xml", result.data[1]);
      if (result.data[0] === "preview") {
        this.previewLoading = false;
      } else {
        this.generateLoading = false;
        if (this.settings.selected === "Editor") {
          let win = window.open("./drawio/index.html");
          win.onload = function() {
            win.createGraph(result.data[1]);
            win.edit();
          };
        } else {
          this.actions.openWith("Interact");
        }
      }
    },
    // @vuese
    // Launch Preview Action in Web Worker
    preview() {
      /*eslint no-console: ["error", {"allow": ["log"]}] */
      this.previewLoading = true;
      this.myWorker.postMessage([this.settings, this.data, "preview"]);
    }
  },
  created() {
    if (window.Worker) {
      this.myWorker = new MapWorker();
      this.myWorker.onmessage = this.receiveXML;
    }
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  beforeDestroy() {
    this.myWorker.terminate();
  }
};
</script>

<style>
.add-space {
  padding: 0.5em 1em;
}
p > a {
  color: #167df0 !important;
}
</style>
