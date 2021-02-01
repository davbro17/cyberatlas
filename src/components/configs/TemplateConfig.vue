<template>
  <div class="column is-full-width">
    <div class="tabs is-boxed">
      <ul>
        <li
          v-for="(tab, index) in tabs"
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
    <!-- Tabs -->
    <b-tabs type="is-boxed" @input="scrollUp()">
      <!-- Data Tab -->
      <b-tab-item label="Data" icon="filter">
        <div ref="tabContent" style="max-height:405px;overflow:auto;">
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
          <slot name="data" />
        </div>
      </b-tab-item>
      <!-- Style Tab -->
      <b-tab-item label="Style" icon="edit">
        <slot name="style" />
      </b-tab-item>
      <!-- Layout Tab -->
      <b-tab-item label="Layout" icon="object-group">
        <config-title
          label="Autoposition"
          config="autoposition"
          :defaults.sync="defaults"
        >
          <template #extra>
            <b-checkbox v-model="self.autoposition" type="is-info" />
          </template>
        </config-title>
        <config-title
          label="X Position"
          config="geometry.x"
          :defaults.sync="defaults"
        >
          <template #extra>
            <input
              class="input is-info"
              type="text"
              placeholder="10"
              v-model.number="self.geometry.x"
              :disabled="self.autoposition"
            />
          </template>
        </config-title>
        <config-title
          label="Y Position"
          config="geometry.y"
          :defaults.sync="defaults"
        >
          <template #extra>
            <input
              class="input is-info"
              type="text"
              placeholder="10"
              v-model.number="self.geometry.y"
              :disabled="self.autoposition"
            />
          </template>
        </config-title>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">width</label>
          </div>
          <div class="field-body">
            <b-field grouped>
              <b-checkbox
                v-model="self.autowidth"
                type="is-info"
                style="margin-right:10px;"
                v-if="autosizing"
              >
                Automatic
              </b-checkbox>
              <p class="control is-expanded has-icons-left">
                <input
                  class="input is-info"
                  type="text"
                  placeholder="200"
                  :disabled="autosizing && self.autowidth"
                  v-model.number="self.geometry.width"
                />
              </p>
            </b-field>
            <b-field v-if="!self.singleton">
              <b-radio-button
                v-model="self.widthUnits"
                :type="self.autowidth ? '' : 'is-info'"
                native-value="pixels"
                :disabled="self.autowidth"
              >
                pixels
              </b-radio-button>
              <b-radio-button
                v-model="self.widthUnits"
                :type="self.autowidth ? '' : 'is-info'"
                native-value="device"
                :disabled="self.autowidth"
              >
                device widths
              </b-radio-button>
            </b-field>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">height</label>
          </div>
          <div class="field-body">
            <b-field grouped>
              <b-checkbox
                v-model="self.autoheight"
                type="is-info"
                style="margin-right:10px;"
                v-if="autosizing"
              >
                Automatic
              </b-checkbox>
              <p class="control is-expanded has-icons-left">
                <input
                  class="input is-info"
                  type="text"
                  placeholder="100"
                  :disabled="autosizing && self.autoheight"
                  v-model.number="self.geometry.height"
                />
              </p>
            </b-field>
            <b-field v-if="!self.singleton">
              <b-radio-button
                v-model="self.heightUnits"
                :type="self.autoheight ? '' : 'is-info'"
                native-value="pixels"
                :disabled="self.autoheight"
              >
                pixels
              </b-radio-button>
              <b-radio-button
                v-model="self.heightUnits"
                :type="self.autoheight ? '' : 'is-info'"
                native-value="device"
                :disabled="self.autoheight"
              >
                device heights
              </b-radio-button>
            </b-field>
          </div>
        </div>
        <slot name="layout"> </slot>
      </b-tab-item>
      <!-- Links Tab -->
      <b-tab-item label="Links" icon="exchange-alt"> </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import ConfigTitle from "../templates/ConfigTitle.vue";

const tabs = [
  { name: "Data", icon: "filter" },
  { name: "Style", icon: "edit" },
  { name: "Layout", icon: "object-group" },
  { name: "Links", icon: "exchange-alt" }
];
export default {
  props: {
    self: Object,
    autosizing: Boolean,
    defaults: {
      type: Object,
      default() {
        return null;
      }
    },
    tabs: {
      type: Array,
      default() {
        return tabs;
      }
    },
    value: {
      type: Number,
      default: 0
    }
  },
  methods: {
    scrollUp() {
      // eslint-disable-next-line no-console
      console.log("scroll");
      this.$refs.tabContent.scrollTop = 0;
      this.$nextTick(() => {
        this.$refs.tabContent.scrollTop = 0;
      });
    },
    selectTab(index) {
      // eslint-disable-next-line no-console
      console.log(index);
      if (this.value == index) {
        // eslint-disable-next-line no-console
        console.log("test");
        this.$refs.tabContent.scrollTop = 0;
      } else {
        this.$emit("input", index);
      }
    }
  },
  components: {
    ConfigTitle
  }
};
</script>

<style lang="scss" scoped>
::v-deep .tabs li.is-active a {
  color: #167df0;
}
::v-deep .tab-content {
  padding-left: 0rem;
  padding-right: 0rem;
}
</style>
