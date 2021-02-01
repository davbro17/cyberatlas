<template>
  <tab-bar v-model="selected" :tabs="tabs">
    <component
      v-for="(tab, index) in tabs"
      :key="index"
      :is="tab.component"
      v-show="index == selected"
      :self.sync="self"
      :defaults.sync="defaults"
    />
  </tab-bar>
</template>

<script>
import TabBar from "./TabBar.vue";
import DataTab from "./DataTab.vue";
import StyleTab from "./StyleTab.vue";
import LayoutTab from "./LayoutTab.vue";
import LinksTab from "./LinksTab.vue";

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
      selected: 0,
      tabs: [
        { name: "Data", icon: "filter", component: "DataTab" },
        { name: "Style", icon: "edit", component: "StyleTab" },
        { name: "Layout", icon: "object-group", component: "LayoutTab" },
        { name: "Links", icon: "exchange-alt", component: "LinksTab" }
      ]
    };
  },
  components: {
    TabBar,
    DataTab,
    StyleTab,
    LayoutTab,
    LinksTab
  }
};
</script>
