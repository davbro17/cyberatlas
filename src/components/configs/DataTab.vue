<template>
  <div>
    <div v-if="!self.singleton" class="field">
      <config-title
        label="Object Name"
        config="title"
        :defaults.sync="defaults"
        force
      />
      <div class="field">
        <input
          class="input is-info"
          type="text"
          :placeholder="self.name"
          v-model="self.title"
        />
      </div>
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
            <div
              class="control"
              style="padding-top:0.25em; margin-left:-0.5em;margin-right:0.5em;"
            >
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
                :placeholder="self.singleton ? '192.168.0.1' : '192.168.0.0/24'"
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
    return {
      command: {
        action: "Filter",
        cidr: "",
        sheet: "",
        column: "",
        id: null
      },
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
    ConfigTitle
  },
  mounted() {
    this.command.id = this.self.id;
  }
};
</script>
