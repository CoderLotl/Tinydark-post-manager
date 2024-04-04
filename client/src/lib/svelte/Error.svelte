<script>
    import { navigate } from 'svelte-routing';
    import { BASE_PATH } from "../stores/stores.js";
    import { get } from 'svelte/store';
    import { onMount } from 'svelte';
    import { GoBack } from '../js/utilities/utilities.js';

    import sadFrog from '../../assets/sad-frog.jpg';

    onMount(() =>
    {
        let BASE_PATH_ = get(BASE_PATH);
        navigate(`${BASE_PATH_}` + '/error', { replace: true }); // Replace the current entry in the history stack
    });
</script>

<img src={sadFrog} class="logo frog" alt="dancing frog" />
<p>That place doesn't exist.</p>
<button id="back-btn" on:click={GoBack}>« Go back</button>