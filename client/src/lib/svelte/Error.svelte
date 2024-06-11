<script>
    import { navigate } from 'svelte-routing';
    import { BASE_PATH, APP_NAME } from "../js/stores/stores.js";
    import { get } from 'svelte/store';
    import { onMount } from 'svelte';
    import Main from './components/Main.svelte';
    import Footer from './components/Footer.svelte';

    import sadFrog from '../../assets/sad-frog.jpg';
    $: APP_NAME_ = $APP_NAME;

    onMount(() =>
    {
        let BASE_PATH_ = get(BASE_PATH);
        navigate(`${BASE_PATH_}` + '/error', { replace: true }); // Replace the current entry in the history stack
    });

    function GoBack(event)
    {
        event.preventDefault();
        let BASE_PATH_ = get(BASE_PATH);
        navigate(`${BASE_PATH_}` + '/home');
    }
</script>

<svelte:head>
    <title>{APP_NAME_} - ERROR</title>    
</svelte:head>

<Main>
    <div class="flex flex-col h-full w-full justify-center items-center">
        <img src={sadFrog} class="logo frog" alt="dancing frog" />
        <p class="w-full text-center bg-slate-950 text-gray-200 mt-4 mb-4">You may be lost. That place doesn't exist.</p>
        <button id="back-btn" on:click={GoBack} class="p-4 bg-orange-600 rounded-md hover:bg-orange-500">Go Home</button>
    </div>
    <Footer>        
    </Footer>
</Main>