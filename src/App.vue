<template>
  <div id="app">
    <!-- Navigation Bar -->
    <nav
      class="navbar is-info add-space has-shadow"
      role="navigation"
      aria-label="main navigation"
    >
      <!-- CyberAtlas Logo -->
      <div class="navbar-brand">
        <figure class="image is-64x64">
          <img src="./assets/cyberatlas.png" />
        </figure>
        <a class="navbar-item" @click="appDrawer = !appDrawer">
          <h1 class="title" style=";color:#fff;">
            CyberAtlas
          </h1>
        </a>
        <a
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          @click="burgerToggle = !burgerToggle"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-menu" v-bind:class="{ 'is-active': burgerToggle }">
        <div class="navbar-start">
          <div class="navbar-item">
            <button class="button is-info" @click="appDrawer = !appDrawer">
              <span>{{ $route.name }} </span>
              <b-icon :icon="appDrawer ? 'angle-up' : 'angle-down'"></b-icon>
            </button>
          </div>
        </div>
        <div class="navbar-end">
          <!-- Performance Modal Button -->
          <div class="navbar-item">
            <button
              class="button is-info is-medium"
              @click="
                () => {
                  performanceModalActive = true;
                }
              "
            >
              <strong>
                Performance
              </strong>
            </button>
          </div>
          <!-- Performance Modal -->
          <div
            class="modal"
            v-bind:class="{ 'is-active': performanceModalActive }"
          >
            <div class="modal-background"></div>
            <div class="modal-card">
              <header class="modal-card-head">
                <p class="modal-card-title">Performance</p>
                <button
                  class="delete"
                  aria-label="close"
                  @click="
                    () => {
                      performanceModalActive = false;
                    }
                  "
                />
              </header>
              <section class="modal-card-body">
                <!-- Content ... -->
                <b-field label="Dark Mode">
                  <button
                    class="button is-info is-outlined"
                    @click="setPreferredColorScheme()"
                  >
                    Toggle
                  </button>
                </b-field>
                <b-field
                  label="Worker Count (Constraints: Browser, Max # of Threads)"
                >
                  <b-slider
                    :min="1"
                    :max="workers.concurrencyMax"
                    ticks
                    v-model.number="workers.count"
                    type="is-info"
                  >
                  </b-slider>
                </b-field>
                <b-field label="Chunk Size (KB)">
                  <input
                    class="input is-info"
                    placeholder="50"
                    v-model.number="workers.chunkSize"
                  />
                </b-field>
              </section>
            </div>
          </div>
          <!-- Documentation Link Button -->
          <div class="navbar-item">
            <button class="button is-info is-medium" @click="openDocs">
              <strong>
                Documentation
              </strong>
            </button>
          </div>
        </div>
      </div>
    </nav>
    <div class="columns section is-centered app-drawer" v-if="appDrawer">
      <div
        v-for="(group, index) in drawer"
        :key="index"
        class="column"
        v-bind:class="{ 'is-offset-1': index == 0 }"
      >
        <aside class="menu">
          <p class="menu-label">
            {{ group.heading }}
          </p>
          <ul
            class="menu-list"
            v-for="(tool, index) in group.tools"
            :key="index"
          >
            <li>
              <a @click="route(tool.name)">
                <span> {{ tool.name }} </span>
                <span
                  class="tag is-info is-warning"
                  style="margin-left:5px;"
                  v-if="tool.beta"
                >
                  Coming Soon
                </span>
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </div>
    <router-view v-bind.sync="appData" />
    <!-- Footer -->
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>CyberAtlas</strong> by
          <!-- Personal Email Link -->
          <a href="mailto:david.c.brownfield3.mil@mail.mil"
            >1LT David Brownfield
          </a>
          . The source code is licensed
          <!-- Source Code License -->
          <a href="https://choosealicense.com/licenses/gpl-3.0/">GNU GPLv3</a>.
          The website content is licensed
          <!-- Website License -->
          <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
            >CC BY NC SA 4.0</a
          >.
        </p>
      </div>
    </footer>
  </div>
</template>
<script>
const inputObject = () => {
  return {
    sheets: [],
    headers: [],
    customHeaders: [],
    sheetIndex: 0,
    files: []
  };
};

export default {
  data() {
    return {
      selectedApp: "Map",
      appOptions: [
        "Map",
        "Extract",
        "Compare",
        "Merge",
        "Interact",
        "Automate"
      ],
      burgerToggle: false,
      appData: {
        actions: {},
        map: {
          xml: "",
          interactive: null
        },
        input1: inputObject(),
        input2: inputObject()
      },
      workers: {
        concurrencyMax: 1,
        count: 1,
        chunkSize: 50
      },
      performanceModalActive: false,
      darkMode: false,
      appDrawer: false,
      drawer: [
        {
          heading: "Data Operations",
          tools: [
            {
              name: "Extract",
              beta: false
            },
            {
              name: "Merge",
              beta: false
            },
            {
              name: "Compare",
              beta: false
            },
            {
              name: "Transform",
              beta: true
            }
          ]
        },
        {
          heading: "Diagraming Tools",
          tools: [
            {
              name: "Map",
              beta: false
            },
            {
              name: "Interact",
              beta: false
            },
            {
              name: "Draw",
              beta: false
            }
          ]
        },
        {
          heading: "Automation Tools",
          tools: [
            {
              name: "Automate",
              beta: false
            },
            {
              name: "Drag N Drop",
              beta: true
            },
            {
              name: "Command",
              beta: true
            }
          ]
        }
      ]
    };
  },
  methods: {
    // @vuese
    // Open a new tab to the Documentation
    openDocs() {
      window.open("./docs/index.html");
    },
    // @vuese
    // Open a new tab to the Documentation
    route(path) {
      if (path === "Map") {
        this.$router.push("/");
      } else if (path == "Draw") {
        let win = window.open("./drawio/index.html");
        win.onload = function() {
          win.edit();
        };
      } else {
        this.$router.push("/" + path);
      }
      // Class the app drawer
      this.appDrawer = !this.appDrawer;
    },
    // @vuese
    // Allow tools to transfer data between each other
    openWith(appName) {
      //this.$set(this.actions, "transferData", data);
      this.route(appName);
    },
    setPreferredColorScheme() {
      const mode = this.darkMode ? "dark" : "light";
      for (var i = document.styleSheets[0].rules.length - 1; i >= 0; i--) {
        let rule = document.styleSheets[0].rules[i].media;
        if (rule.mediaText.includes("prefers-color-scheme")) {
          switch (mode) {
            case "light":
              rule.appendMedium("original-prefers-color-scheme");
              if (rule.mediaText.includes("light"))
                rule.deleteMedium("(prefers-color-scheme: light)");
              if (rule.mediaText.includes("dark"))
                rule.deleteMedium("(prefers-color-scheme: dark)");
              this.darkMode = true;
              break;
            case "dark":
              rule.appendMedium("(prefers-color-scheme: light)");
              rule.appendMedium("(prefers-color-scheme: dark)");
              if (rule.mediaText.includes("original"))
                rule.deleteMedium("original-prefers-color-scheme");
              this.darkMode = false;
              break;
            default:
              rule.appendMedium("(prefers-color-scheme: dark)");
              if (rule.mediaText.includes("light"))
                rule.deleteMedium("(prefers-color-scheme: light)");
              if (rule.mediaText.includes("original"))
                rule.deleteMedium("original-prefers-color-scheme");
              this.darkMode = false;
          }
          break;
        }
      }
    }
  },
  mounted() {
    this.appData.actions["openWith"] = this.openWith;
    this.workers.concurrencyMax = parseInt(
      window.navigator.hardwareConcurrency
    );
  }
};
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";

// Set your colors
$primary: #167df0;
$primary-invert: findColorInvert($primary);

$info: #167df0;
$info-invert: findColorInvert($primary);

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
  "white": (
    $white,
    $black
  ),
  "black": (
    $black,
    $white
  ),
  "light": (
    $light,
    $light-invert
  ),
  "dark": (
    $dark,
    $dark-invert
  ),
  "primary": (
    $primary,
    $primary-invert
  ),
  "info": (
    $info,
    $info-invert
  ),
  "success": (
    $success,
    $success-invert
  ),
  "warning": (
    $warning,
    $warning-invert
  ),
  "danger": (
    $danger,
    $danger-invert
  )
);

// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
@import "~bulma-prefers-dark/bulma-prefers-dark.sass";

#app {
  font-family: Arial;
}
.add-space {
  padding: 0.5em 1em;
}
p > a {
  color: #167df0 !important;
}
.panel-heading.pointer {
  cursor: pointer;
}
.panel-heading > .level {
  height: 35px;
}
.panel-heading {
  padding: 0.25em 0.75em;
}
.panel-body {
  border: 1px solid #dbdbdb;
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
    0 0 0 1px rgba(10, 10, 10, 0.02);
  padding: 0.5em 0.75em;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}
.field.has-addons .control:first-child .control .input {
  border-bottom-right-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 0px;
  border-top-left-radius: 0px;
}
td > .textarea {
  background-color: inherit;
  min-width: 100%;
  padding: 0.6em 0.75em;
  border-width: 0px;
  font-size: 1em;
  resize: none;
  vertical-align: middle;
  border: none;
}

.app-drawer {
  background-color: #f2f2f2;
}

// Dark Mode Preferences
@media (prefers-color-scheme: dark) {
  .select select {
    background-color: #0a0a0a;
    color: #b5b5b5;
  }
  .button.is-info.is-outlined {
    color: #b5b5b5;
    background-color: #0a0a0a;
  }
  .button.is-danger.is-outlined {
    color: #b5b5b5;
    background-color: #0a0a0a;
  }
  .input:disabled {
    background-color: #0a0a0a;
  }
  .tabs.is-boxed li.is-active a {
    background-color: #17181c;
  }
  body {
    background-color: #0a0a0a;
  }
  .panel-body {
    border: 1px solid #363636;
    background-color: #17181c;
  }
  .modal-card-body {
    background-color: gray;
  }
  .app-drawer {
    background-color: #363636;
  }
  @media screen and (max-width: 1023px) {
    .navbar-menu {
      background-color: #0d64c6;
      box-shadow: none;
      -webkit-box-shadow: none;
    }
  }
}
</style>
