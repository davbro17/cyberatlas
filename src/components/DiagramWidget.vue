<template>
  <div
    class="graph_container"
    ref="graph_container"
    :style="[centered ? { margin: 'auto' } : { margin: '0px' }, styleObj]"
  />
</template>

<script>
import {
  mxGraph,
  mxCodec,
  mxUtils,
  mxConstants,
  mxStencilRegistry,
  mxStencil
} from "mxgraph/javascript/mxClient.js";

export default {
  name: "HelloWorld",
  props: {
    xml: {
      type: String,
      default: null,
      graph: null
    },
    interactive: Boolean,
    centered: Boolean,
    width: {
      type: String,
      default: "auto"
    },
    height: {
      type: String,
      default: "auto"
    }
  },
  data() {
    return {
      styleObj: {
        width: this.width,
        height: this.height
      }
    };
  },
  methods: {
    init() {
      // Creates the graph inside the given container
      const graph = new mxGraph(this.$refs.graph_container);
      this.graph = graph;
      graph.setHtmlLabels(true);
      graph.setEnabled(this.interactive);

      // Loads the stencils into the registry
      const req = mxUtils.load("./drawio/webapp/stencils/citrix.xml");
      const root = req.getDocumentElement();
      let shape = root.firstChild;

      while (shape != null) {
        if (shape.nodeType == mxConstants.NODETYPE_ELEMENT) {
          mxStencilRegistry.addStencil(
            "mxgraph.citrix.".concat(
              shape
                .getAttribute("name")
                .toLowerCase()
                .replace(/ /g, "_")
            ),
            new mxStencil(shape)
          );
        }

        shape = shape.nextSibling;
      }

      let stylesheet = mxUtils.load("./default.xml");
      if (stylesheet != null) {
        const xmlDoc = stylesheet.getDocumentElement();
        const dec = new mxCodec(xmlDoc);
        dec.decode(xmlDoc, graph.getStylesheet());
      }
      const xml = this.xml
        ? this.xml
        : `<mxGraphModel dx="1186" dy="781" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="3" value="" style="group" parent="1" vertex="1" connectable="0"><mxGeometry x="0" y="0" width="90" height="118.5" as="geometry"/></mxCell><mxCell id="4" value="" style="fillColor=none;rounded=0;fontStyle=1;strokeColor=none;" parent="3" vertex="1"><mxGeometry x="0" y="0" width="90" height="118.5" as="geometry"/></mxCell><mxCell id="5" value="" style="group" parent="3" vertex="1" connectable="0"><mxGeometry x="10" y="10" width="70" height="70" as="geometry"/></mxCell><mxCell id="6" value="" style="aspect=fixed;html=1;fillColor=none;strokeColor=none;align=center;outlineConnect=0;" parent="5" vertex="1"><mxGeometry x="0" y="0" width="70" height="70" as="geometry"/></mxCell><mxCell id="7" value="WindowsXP&lt;br&gt;" style="shape=mxgraph.citrix.desktop;verticalLabelPosition=bottom;aspect=fixed;html=1;verticalAlign=top;align=center;outlineConnect=0;" parent="5" vertex="1"><mxGeometry x="0" y="0" width="70" height="70" as="geometry"/></mxCell><mxCell id="8" value="" style="group" parent="1" vertex="1" connectable="0"><mxGeometry x="0" y="128.5" width="90" height="118.5" as="geometry"/></mxCell><mxCell id="9" value="" style="fillColor=none;rounded=0;fontStyle=1;strokeColor=none;" parent="8" vertex="1"><mxGeometry x="0" y="0" width="90" height="118.5" as="geometry"/></mxCell><mxCell id="10" value="" style="group" parent="8" vertex="1" connectable="0"><mxGeometry x="10" y="10" width="70" height="70" as="geometry"/></mxCell><mxCell id="11" value="" style="aspect=fixed;html=1;fillColor=none;strokeColor=none;align=center;outlineConnect=0;" parent="10" vertex="1"><mxGeometry x="0" y="0" width="70" height="70" as="geometry"/></mxCell><mxCell id="12" value="WindowsXP&lt;br&gt;" style="shape=mxgraph.citrix.desktop;verticalLabelPosition=bottom;aspect=fixed;html=1;verticalAlign=top;align=center;outlineConnect=0;" parent="10" vertex="1"><mxGeometry x="0" y="0" width="70" height="70" as="geometry"/></mxCell></root></mxGraphModel>`;
      const doc = mxUtils.parseXml(xml);
      const codec = new mxCodec(doc);
      codec.decode(doc.documentElement, graph.getModel());
      //graph.fit();
    }
  },
  mounted() {
    // Check if graph library (mxClient) is loaded to global namespace
    if (window["mxCell"]) {
      // Initialize the graph
      this.init();
    } else {
      // Load the script via LoadScript vue plugin (see main.js)
      // THEN initialize the graph
      this.$loadScript("./mxClient.min.js").then(() => this.init());
    }
  },
  watch: {
    xml() {
      const xml = this.xml
        ? this.xml
        : `<mxGraphModel dx="1186" dy="781" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100" math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/><mxCell id="3" value="" style="group" parent="1" vertex="1" connectable="0"><mxGeometry x="0" y="0" width="90" height="118.5" as="geometry"/></mxCell><mxCell id="4" value="" style="fillColor=none;rounded=0;fontStyle=1;strokeColor=none;" parent="3" vertex="1"><mxGeometry x="0" y="0" width="90" height="118.5" as="geometry"/></mxCell><mxCell id="5" value="" style="group" parent="3" vertex="1" connectable="0"><mxGeometry x="10" y="10" width="70" height="70" as="geometry"/></mxCell><mxCell id="6" value="" style="aspect=fixed;html=1;fillColor=none;strokeColor=none;align=center;outlineConnect=0;" parent="5" vertex="1"><mxGeometry x="0" y="0" width="70" height="70" as="geometry"/></mxCell><mxCell id="7" value="WindowsXP&lt;br&gt;" style="shape=mxgraph.citrix.desktop;verticalLabelPosition=bottom;aspect=fixed;html=1;verticalAlign=top;align=center;outlineConnect=0;" parent="5" vertex="1"><mxGeometry x="0" y="0" width="70" height="70" as="geometry"/></mxCell><mxCell id="8" value="" style="group" parent="1" vertex="1" connectable="0"><mxGeometry x="0" y="128.5" width="90" height="118.5" as="geometry"/></mxCell><mxCell id="9" value="" style="fillColor=none;rounded=0;fontStyle=1;strokeColor=none;" parent="8" vertex="1"><mxGeometry x="0" y="0" width="90" height="118.5" as="geometry"/></mxCell><mxCell id="10" value="" style="group" parent="8" vertex="1" connectable="0"><mxGeometry x="10" y="10" width="70" height="70" as="geometry"/></mxCell><mxCell id="11" value="" style="aspect=fixed;html=1;fillColor=none;strokeColor=none;align=center;outlineConnect=0;" parent="10" vertex="1"><mxGeometry x="0" y="0" width="70" height="70" as="geometry"/></mxCell><mxCell id="12" value="WindowsXP&lt;br&gt;" style="shape=mxgraph.citrix.desktop;verticalLabelPosition=bottom;aspect=fixed;html=1;verticalAlign=top;align=center;outlineConnect=0;" parent="10" vertex="1"><mxGeometry x="0" y="0" width="70" height="70" as="geometry"/></mxCell></root></mxGraphModel>`;
      const doc = mxUtils.parseXml(xml);
      const codec = new mxCodec(doc);
      codec.decode(doc.documentElement, this.graph.getModel());
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.graph_container {
  border: 0;
  left: 0;
  position: relative;
  top: 0;
  margin: auto;
  z-index: 9999;
}
</style>
