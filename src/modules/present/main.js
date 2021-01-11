//import Worker from "worker-loader!./present.worker.js"

export default {
  //worker: new Worker(),
  prompts: [
    "create a slide presentation",
    "present slides"
  ],
  files: [
    "config",
    "objects"
  ],
  web: import(
    /* webpackChunkName: "PresentConfig" */
    /* webpackMode: "lazy" */
    "./PresentGUI.svelte"
  )
}