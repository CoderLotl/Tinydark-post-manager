<script>
    import { CheckIfLoggedIn } from '../js/utilities/utilities.js';
    import { navigate } from 'svelte-routing';
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { BASE_PATH } from "../js/stores/stores.js";

    
    onMount(async ()=>
    {
        let BASE_PATH_ = get(BASE_PATH);
        console.log(BASE_PATH_);
        let loggedIn = await CheckIfLoggedIn();
        if(loggedIn == true)
        {
            navigate(`${BASE_PATH_}` + '/home', { replace: true });
        }
        else
        {
            navigate(`${BASE_PATH_}` + '/login', { replace: true });
        }
    });
</script>