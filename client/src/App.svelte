<script>
// @ts-nocheck

  // IMPORTS
  import { Router, Route } from 'svelte-routing';
  import { BACK_PATH, BASE_PATH} from "./lib/js/stores/stores.js";
  import { writable, get } from 'svelte/store';
  import { GetAppName } from './lib/js/utilities/app.js';
  import { globals } from './config/config.js';

  // COMPONENTS
  import Login from './lib/svelte/Login.svelte';
  import Home from './lib/svelte/Home.svelte';
  import Edit_Post from './lib/svelte/Edit_Post.svelte';
  import Register from './lib/svelte/Register.svelte';
  import Verify from './lib/svelte/Verify.svelte';
  import Error from './lib/svelte/Error.svelte';

  const isDev = import.meta.env.MODE;

  if(isDev == 'development')
  {
    BASE_PATH.set(globals.development.base_path);
    BACK_PATH.set(globals.development.back_path); // << - - - SET YOUR DEV URL AT CONFIG.JS    
  }
  else
  {
    BASE_PATH.set(globals.live.base_path);
    BACK_PATH.set(globals.live.back_path); // << - - - SET YOUR PROD URL AT CONFIG.JS
  }
  
  let BASE_PATH_ = get(BASE_PATH);

  GetAppName();

  const routes = [
    { path: `${BASE_PATH_}/`, component: Login },
    { path: `${BASE_PATH_}/home`, component: Home },
    { path: `${BASE_PATH_}/edit_post`, component: Edit_Post},
    { path: `${BASE_PATH_}/register`, component: Register },
    { path: `${BASE_PATH_}/verify/:code`, component: Verify},
    // Add other routes here
    { path: `${BASE_PATH_}/*`, component: Error } // Catch-all route
  ];

</script>

<Router>
  {#each routes as { path, component }}
    <Route {path} let:params>
        <svelte:component this={component} {...params} />
    </Route>
  {/each}
</Router>
