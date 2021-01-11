<script>
  import Icon from 'fa-svelte';
  import { faArrowDown, faArrowUp, faBars, faEdit, faDatabase, faBriefcase, faBook, faSlidersH, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
  import {listView} from "../store/AppOptions";
  import { createEventDispatcher } from 'svelte';
  import LoginView from "../views/LoginView.svelte";

  const dispatch = createEventDispatcher();

  function changeView(viewName){
    dispatch("changeView", {
      view: viewName
    });
  }

  let links = [
    {
      title: "Projects",
      icon: faBriefcase,
      action: () => changeView("ProjectView")
    },
    {
      title: "Data",
      icon: faDatabase,
      action: () => changeView("DataView")
    },
    {
      title: "Documentation",
      icon: faBook,
      action: () => changeView("DocsView")
    },
    {
      title: "Settings",
      icon: faSlidersH,
      action: () => changeView("SettingsView")
    },
    {
      title: "Sign In",
      icon: faSignInAlt,
      action: () => dispatch("openModal", {modal: LoginView})
    }
  ]

  function toggleListView() {
    listView.update(n => !n);
  }
</script>

<nav class="navzone">
  <ul class="navzone-nav">
    <li class="logo">
      <a href="#cyberatlas" class="nav-link">
        <span class="link-text logo-text">CyberAtlas</span>
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fad"
          data-icon="angle-double-right"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
          class="svg-inline--fa fa-angle-double-right fa-w-14 fa-5x"
        >
          <g class="fa-group">
            <path
              fill="currentColor"
              d="M224 273L88.37 409a23.78 23.78 0 0 1-33.8 0L32 386.36a23.94 23.94 0 0 1 0-33.89l96.13-96.37L32 159.73a23.94 23.94 0 0 1 0-33.89l22.44-22.79a23.78 23.78 0 0 1 33.8 0L223.88 239a23.94 23.94 0 0 1 .1 34z"
              class="fa-secondary"
            ></path>
            <path
              fill="currentColor"
              d="M415.89 273L280.34 409a23.77 23.77 0 0 1-33.79 0L224 386.26a23.94 23.94 0 0 1 0-33.89L320.11 256l-96-96.47a23.94 23.94 0 0 1 0-33.89l22.52-22.59a23.77 23.77 0 0 1 33.79 0L416 239a24 24 0 0 1-.11 34z"
              class="fa-primary"
            ></path>
          </g>
        </svg>
      </a>
    </li>
    {#each links as link}
      <li class="nav-item">
        <a href="#apps" class="nav-link" on:click={link.action}>
          <Icon icon={link.icon} class="linkIcon"/>
          <span class="link-text">{link.title}</span>
        </a>
      </li>
    {/each}
  </ul>
  <div class="app-navzone">
    <ul class="app-nav">
      <li class="nav-item">
        <a href="#display" class="nav-link">
          <Icon icon={faArrowUp} />
        </a>
      </li>
      <li class="nav-item">
        <a href="#display" on:click={toggleListView} class="nav-link">
          <Icon icon={$listView ? faEdit : faBars} />
        </a>
      </li>
      <li class="nav-item">
        <a href="#display" class="nav-link">
          <Icon icon={faArrowDown} />
        </a>
      </li>
    </ul>
  </div>
</nav>

  <style>
.navzone {
  position: fixed;
  z-index: 10;
  background-color: #dbdbdb;
  transition: width 600ms ease;
  overflow: hidden;
}

.app-nav, .navzone-nav {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.navzone-nav {
  background-color: var(--bg-primary);
}

.nav-item {
  width: 100%;
}

.nav-link {
  display: flex;
  align-items: center;
  height: 5rem;
  color: var(--text-primary);
  text-decoration: none;
  filter: grayscale(100%) opacity(0.7);
  transition: var(--transition-speed);
}

a :global(.linkIcon) {
  color: rgb(74, 163, 223);
}

.nav-link:hover {
  filter: grayscale(0%) opacity(1);
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.link-text {
  display: none;
  margin-left: 0.5rem;
}

.nav-link :global(svg) {
  width: 2rem;
  height: 2rem;
  min-width: 2rem;
  margin: 0 1rem;
}

.logo {
  font-weight: bold;
  text-align: center;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  font-size: 1.5rem;
  letter-spacing: 0.3ch;
  width: 100%;
}

.logo svg {
  transform: rotate(0deg);
  transition: var(--transition-speed);
}

.logo-text
{
  display: inline;
  position: absolute;
  left: -999px;
  transition: var(--transition-speed);
}

.navzone-nav:hover .logo svg {
  transform: rotate(-180deg);
}

/* Small screens */
@media only screen and (max-width: 600px) {
  .navzone {
    bottom: 0;
    width: 100vw;
    height: 5rem;
  }

  .navzone:hover {
    height: auto;
  }

  .navzone:hover .logo svg {
    transform: rotate(90deg);
  }

  .nav-link:hover {
    background: var(--bg-primary);
  }

  .logo-text {
    display: none;
  }
  .nav-item:last-child {
    margin-top: unset;
  }

  .logo {
    width: unset;
    margin-bottom: unset;
    background: var(--bg-primary);
  }

  .logo svg {
    transform: rotate(270deg);
  }

  .navzone-nav {
    flex-direction: row-reverse;
    justify-content: center;
    flex-wrap: wrap-reverse;
    overflow: auto;
  }
  .nav-item {
    width: unset;
  }

  .nav-link {
    justify-content: center;
  }
}


/* Large screens */
@media only screen and (min-width: 600px) {
  .navzone {
    top: 0;
    height:100%;
    background-color: var(--bg-main);
  }

  .app-nav {
    background-color: var(--bg-main);
    border-top-left-radius: 2rem 2rem;
  }

  .app-navzone {
    background-color: var(--bg-primary);
  }

  .navzone-nav{
    top: 0;
    width: 4rem;
    border-bottom-right-radius: 2rem 2rem ;
  }

  .navzone-nav:hover {
    width: 16rem;
    height: 100%;
    border-bottom-right-radius: unset;
  }

  .navzone-nav:hover .link-text {
    display: inline;
  }

  .navzone-nav:hover .logo svg
  {
    margin-left: 13rem;
  }
  .app-nav > .nav-item:first-child > .nav-link {
    border-top-left-radius: 2rem 2rem;
  }

  .navzone-nav:hover .logo-text
  {
    left: 0px;
  }
}

  </style>