<script>        
    import { afterUpdate, onMount } from 'svelte';    
    import { GeneratePageButtons, GeneratePosts, CloseDialog, EditPost } from '../js/utilities/home';
    import { currentPage } from '../js/stores/stores.js';

    import Home_header from './components/Home_header.svelte';

    import blob from '../../assets/2022_sm_002.png';
    import compose from '../../assets/compose.png';

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

<Home_header>
    <div class="bg-neutral-200 w-full h-14 py-2 flex justify-center" style="background-color: #1d1d1d;">
        <div id="page_buttons" class="flex justify-center bg-black w-full h-10 md:w-1/2 fixed" style="z-index: 777;">
        </div>
    </div>
</Home_header>

<dialog id="dialog" class="post-dialog w-full md:w-3/5 h-3/4">
    <p id="dialog-title"></p>    
    <div id="dialogContent" class="post-dialogContent">
        <!-- DIALOG CONTENT -->
    </div>
    <div class="flex">
        <button id="btnClose" class="bouncy mt-6" on:click={CloseDialog}>
            <img id="slime" src={blob} alt="Close button" title="Close" style="width: 52px; height: 45px;">
        </button>
        <button id="btnCompose" class="bouncy mt-6" on:click={EditPost}>
            <img id="compose" src={compose} alt="Edit post" title="Edit" style="width: 52px;">
        </button>
    </div>
</dialog>

<div class="flex flex-col items-center w-full relative">
    <div id="posts-titles-container" class="w-screen h-screen flex flex-col items-center overflow-scroll">
        <div id="posts" class="bg-black mt-64 mb-20" style="border-radius: 20px;">
        </div>
    </div>
</div>