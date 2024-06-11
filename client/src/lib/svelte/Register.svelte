<script>
    import { BASE_PATH, APP_NAME } from "../js/stores/stores.js";
    import { onMount } from 'svelte';
    import { AddDismissDialogMechanic } from '../js/utilities/utilities.js';
    import { Register } from '../js/utilities/register';
    import { navigate } from 'svelte-routing';
    import { get } from 'svelte/store';

    import Main from './components/Main.svelte';
    import Footer from './components/Footer.svelte';

    $: APP_NAME_ = $APP_NAME;    

    function GoBack(event)
    {
        event.preventDefault();
        let BASE_PATH_ = get(BASE_PATH);
        navigate(`${BASE_PATH_}` + '/');
    }

    onMount(async ()=>
    {
        AddDismissDialogMechanic('server_message', 'register-btn');
    });    
</script>

<svelte:head>
    <title>{APP_NAME_} - Registration</title>
</svelte:head>

<Main>
    <form id="register-form" class="mt-20 flex flex-col items-center border-2 border-black rounded-md w-4/5 lg:w-2/5 h-4/5 lg:h-3/5 p-4 bg-[#1d1d1d]">

        <div class="w-full flex justify-center bg-[#0C0A0A]">
            <p class="font-['Fjord_One'] text-lg font-bold text-slate-200 p-2">
                Account info
            </p>
        </div>
        <div class="mt-8 w-full">
            <label for="user" class="font-['Fjord_One'] text-lg font-bold text-slate-200">
                Username:
            </label>
            <div class="w-full">
                <input id="user" type="text" placeholder="User" autocomplete="off" class="mb-5 bg-gray-900 text-gray-200 pl-3 py-1 w-11/12">
                <span class="text-[#FC7D18]">*</span>
            </div>
            <label for="mail" class="font-['Fjord_One'] text-lg font-bold text-slate-200">
                E-Mail:
            </label>
            <div>
                <input id="mail" type="email" placeholder="Email" autocomplete="off" class="mb-5 bg-gray-900 text-gray-200 pl-3 py-1 w-11/12">
                <span class="text-[#FC7D18]">*</span>
            </div>
            <label for="password" class="font-['Fjord_One'] text-lg font-bold text-slate-200">
                Password:
            </label>
            <div>
                <input id="password" type="password" placeholder="Password" autocomplete="off" class="mb-5 bg-gray-900 text-gray-200 pl-3 py-1 w-11/12">
                <span class="text-[#FC7D18]">*</span>
            </div>
        </div>
        
        <div id="buttons-div" class="flex flex-col">
            <button id="back-btn" on:click={GoBack} class="m-2 px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-500 shadow-[0_4px_rgba(5,5,59,1)] hover:shadow-[0_4px_rgba(133,133,231,1)] active:translate-y-[4px] active:shadow-[0_0_rgb(133,133,231)] active:transition duration-100
            font-bold text-slate-200">
                « Go back
            </button>
            <button id="register-btn" on:click={Register} class="m-2 px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-500 shadow-[0_4px_rgba(5,5,59,1)] hover:shadow-[0_4px_rgba(133,133,231,1)] active:translate-y-[4px] active:shadow-[0_0_rgb(133,133,231)] active:transition duration-100
            font-bold text-slate-200">
                Register
            </button>
        </div>
    </form>
    <Footer>        
    </Footer>
</Main>
<Footer>        
</Footer>