<template>
  <!-- Main Application -->
  <div class="columns is-multiline add-space">
    <!-- Data Widget -->
    <PanelBlock
      widthClass="is-three-quarters"
      :Open="panelOpen"
      @toggle="bool => (panelOpen = bool)"
    >
      <template #title>
        Generate An Interactive Map
      </template>
      <template #content>
        <diagram-widget :xml="map.xml" :interactive="interactive" />
      </template>
    </PanelBlock>
    <PanelBlock widthClass="is-one-quarter">
      <template #title>
        Device Data
      </template>
    </PanelBlock>
  </div>
</template>
<script>
import PanelBlock from "../components/templates/PanelBlock.vue";
import DiagramWidget from "../components/DiagramWidget.vue";

export default {
  components: {
    PanelBlock,
    DiagramWidget
  },
  data() {
    return {
      interactive: true,
      panelOpen: true
    };
  },
  props: {
    actions: {
      type: Object,
      default() {
        return {};
      }
    },
    map: {
      type: Object,
      required: true
    }
  },
  mounted() {
    window.scrollTo(0, 0);
  }
};
</script>
