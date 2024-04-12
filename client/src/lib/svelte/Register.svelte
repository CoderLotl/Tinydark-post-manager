<script>
    import { onMount } from 'svelte';
    import { GoBack } from '../js/utilities/utilities.js';
    import { Register } from '../js/utilities/register';

    onMount(() =>
    {
        document.getElementById('r-resp-img').className = '';
        document.getElementById('r-resp-msg').textContent = '';
    });    
</script>

<div id="register" class="flex flex-col justify-center items-center h-screen w-screen">
    <form id="register-form" class="flex flex-col items-center border-solid rounded-3xl border border-black w-1/2 lg:w-1/5 md:h-2/5 min-h-min overflow-auto p-4">
        <input id="user" type="text" placeholder="User" autocomplete="off" class="mb-5">
        <input id="mail" type="email" placeholder="Email" autocomplete="off" class="mb-5">
        <input id="password" type="password" placeholder="Password" autocomplete="off" class="mb-5">
        <div id="buttons-div" class="">
            <button id="back-btn" on:click={GoBack} class="bg-red-600 rounded-l-lg px-2">
                « Go back
            </button>
            <button id="register-btn" on:click={Register} class="bg-red-600 rounded-r-lg px-2">
                Register
            </button>
        </div>
        <div id="r-response" class="fcolumn a-center">
            <span id="r-resp-img"></span>
            <p id="r-resp-msg"></p>
        </div>
    </form>
</div>