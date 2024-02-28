<script>
// @ts-nocheck

  // IMPORTS
  import { Router, Route } from 'svelte-routing';    

  // COMPONENTS
  import Login from './lib/svelte/Login.svelte';
  import Home from './lib/svelte/Home.svelte';
  import Edit_Post from './lib/svelte/Edit_Post.svelte';
  import Register from './lib/svelte/Register.svelte';
  import Verify from './lib/svelte/Verify.svelte';
  import Error from './lib/svelte/Error.svelte';

  const routes = [
    { path: '/', component: Login },
    { path: '/home', component: Home },
    { path: '/edit_post', component: Edit_Post},
    { path: '/register', component: Register },
    { path: '/verify/:code', component: Verify},
    // Add other routes here
    { path: '*', component: Error } // Catch-all route
  ];

</script>

<Router>
  {#each routes as { path, component }}
    <Route {path} let:params>
        <svelte:component this={component} {...params} />
    </Route>
  {/each}
</Router>