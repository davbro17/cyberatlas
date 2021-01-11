export default {
  present(){
    return import(
      /* webpackChunkName: "present" */ 
      /* webpackMode: "lazy" */
      "../modules/present/main.js")
  }
}

