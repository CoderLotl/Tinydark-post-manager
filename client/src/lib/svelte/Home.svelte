<script>        
    import { afterUpdate, onMount } from 'svelte';    
    import
    {
        SetPostsPerPage, GeneratePageButtons, GeneratePosts, CloseDialog,
        CloseDeleteDialog, EditPost, ConfirmDeleteDialog, GetTags, SetPosts,
        SetTags
    } from '../js/utilities/home';
    import { StorageManager } from '../js/services/StorageManager';
    import Home_header from './components/Home_header.svelte';
    import blob from '../../assets/2022_sm_002.png';
    import compose from '../../assets/compose.png';

    // FUNCTIONS
    function afterRender(node, callback) {
        afterUpdate(() =>
        {
            callback();
        });
    }

    onMount(async ()=>
    {
        SetPostsPerPage();
        GetTags();
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

<dialog id="dialog" class="post-dialog w-full md:w-3/5 h-3/4 top-24 md:top-36">
    <p id="dialog-title" class="mt-2"></p>    
    <div id="dialogContent" class="post-dialogContent">
        <!-- DIALOG CONTENT -->
    </div>
    <div class="flex mb-2">
        <button id="btnClose" class="bouncy mt-6" on:click={CloseDialog}>
            <img id="slime" src={blob} alt="Close button" title="Close" style="width: 52px; height: 45px;">
        </button>
        <button id="btnCompose" class="bouncy mt-6" on:click={EditPost}>
            <img id="compose" src={compose} alt="Edit post" title="Edit" style="width: 52px;">
        </button>
    </div>
</dialog>

<dialog id="confirm-dialog" class="post-dialog w-full md:w-2/5 h-1/4 top-64">
    <p class="justify-self-center text-slate-200 mt-3">Are you sure you want to delete this post?</p>
    <div class="flex justify-self-center mt-3">
        <button id="btnDeny" class="mr-3" on:click={CloseDeleteDialog}>
            No
        </button>
        <button id="btnConfirm" class="ml-6" on:click={ConfirmDeleteDialog}>
            Yes
        </button>
    </div>
</dialog>

<!-- DROPDOWN SELECTORS -->
<div class="flex justify-around w-full relative mt-32 bg-[#0f0f0f] pb-3">
    <div class="flex flex-col">
        <label for="posts-amount" class="text-orange-500">
            Posts per Page
        </label>
        <select id="posts-amount" class="bg-neutral-900 text-center" on:change={SetPosts}>            
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
        </select>
    </div>
    <div class="flex flex-col">
        <label for="tags" class="text-orange-500">
            Tags
        </label>
        <select id="tags" class="bg-neutral-900 text-center" on:change={SetTags}>
            
        </select>
    </div>
</div>

<!-- POSTS SECTION -->
<div class="flex flex-col items-center w-full relative">
    <div id="posts-titles-container" class="w-full h-full flex flex-col items-center overflow-visible md:mt-20">
        <div class="w-full md:w-3/4 bg-[#0f0f0f] md:rounded-t-[20px] p-3">
            <button class="rounded-xl">
                Create New Post
            </button>
        </div>
        <div id="posts" class="w-full flex flex-col items-center md:w-3/4 bg-black mb-10 md:mb-20 rounded-b-[20px]">
        </div>
    </div>
</div>