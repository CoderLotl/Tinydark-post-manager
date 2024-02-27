<script>        
    import { afterUpdate, onMount } from 'svelte';
    import { Logout } from '../js/utilities/home';    
    import { StorageManager } from '../js/services/StorageManager';    
    import { GeneratePageButtons, GeneratePosts, CloseDialog } from '../js/utilities/home';
    import { currentPage } from '../js/stores/stores.js';

    import blob from '../../assets/2022_sm_002.png';
    import logo_light from '../../assets/logo_light.svg';
    
    let sm = new StorageManager();
    let name = sm.ReadLS('user');
    let page; $:{ page = $currentPage; }

    function afterRender(node, callback) {
        afterUpdate(() =>
        {
            callback();
        });
    }

    onMount(async ()=>
    {
        GeneratePageButtons();
        GeneratePosts();
    });
</script>

<svelte:head>
    <title>Posts Manager - Home</title>
</svelte:head>

<header class="px-2 md:px-0 fixed w-screen" style="z-index: 777;">
    <div class="container mx-auto py-2 flex justify-between items-center">
        <a class="logo_holder" href="https://tinydark.com/">
            <span id="slimeholder" class="bouncy">
                <img id="slime" src={blob} alt="a black blob with eyes" title="Tinyblob welcomes you! " style="width: 52px; height: 45px;">
            </span>
            <img class="ml-2" src={logo_light} id="logo" alt="">
        </a>
        <nav class="flex items-center">
            <p class="m-0">Welcome {name}.</p>
            <button style="margin-left: 20px;" type="button" on:click={Logout}>
                Log out
            </button>
        </nav>

        <!-- <input id="menu-toggle" type="checkbox">
        <label class="menu-button-container" for="menu-toggle">
        <div class="menu-button"></div>
        <nav>
            <ul class="menu" style="display: none;">
                {#if checked}
                    {#if !$isLoggedIn}
                        
                        <li>
                            <button type="button" on:click={showModal}>
                                Sign in
                            </button>
                        </li>
                    {:else}
                        
                        <li>
                            <p class="m-0">Welcome, {name}.</p>
                        </li>
                        <li>
                            <button style="margin-left: 20px;" type="button" on:click={handleLogout}>
                                Log out
                            </button>
                        </li>
                    {/if}      
                {/if}              
            </ul>
        </nav> -->
    </div>
    <div class="bg-neutral-200 w-full h-14 py-2 flex justify-center" style="background-color: #1d1d1d;">
        <div id="page_buttons" class="flex justify-center bg-black w-full h-10 md:w-1/2 fixed" style="z-index: 777;">
        </div>
    </div>
</header>

<dialog id="dialog" class="post-dialog">
    <div id="dialogContent" class="post-dialogContent">
        <!-- DIALOG CONTENT -->
    </div>
    <button id="btnClose" class="bouncy" on:click={CloseDialog}>
        <img id="slime" src={blob} alt="a black blob with eyes" title="Tinyblob welcomes you! " style="width: 52px; height: 45px;">
    </button>
</dialog>

<div class="flex flex-col items-center w-full relative">
    <div id="posts-titles-container" class="w-screen h-screen flex flex-col items-center overflow-scroll">
        <div id="posts" class="bg-black mt-64 mb-20">
        </div>
    </div>
</div>