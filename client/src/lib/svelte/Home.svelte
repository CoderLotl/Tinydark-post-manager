<script>        
    import { afterUpdate, onMount } from 'svelte';    
    import { SetPostsPerPage, GeneratePageButtons, GeneratePosts, CloseDialog, EditPost, GetTags } from '../js/utilities/home';
    import { StorageManager } from '../js/services/StorageManager';
    import Home_header from './components/Home_header.svelte';
    import blob from '../../assets/2022_sm_002.png';
    import compose from '../../assets/compose.png';
    
    let sm = new StorageManager();
    let page = sm.ReadSS('currentPage') || 1;
    let tag = sm.ReadSS('currentTag') || 'All';
    let posts_per_page = sm.ReadSS('posts-per-page') || 5;

    function afterRender(node, callback) {
        afterUpdate(() =>
        {
            callback();
        });
    }

    function setPosts(event)
    {
        let selectedOption = event.target.value;
        posts_per_page = selectedOption;
        sm.WriteSS('posts-per-page', selectedOption);
        GeneratePageButtons(page, posts_per_page);
        GeneratePosts(page, posts_per_page);
    }

    function setTags(event)
    {
        let selectedTag = event.target.value;
        tag = selectedTag;
        sm.WriteSS('currentTag', selectedTag);
    }

    onMount(async ()=>
    {
        SetPostsPerPage(posts_per_page);
        GetTags();
        GeneratePageButtons(page, posts_per_page);
        GeneratePosts(page, posts_per_page);
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

<div class="flex justify-around w-full relative mt-32 bg-[#0f0f0f] pb-3">
    <div class="flex flex-col">
        <label for="posts-amount" class="text-orange-500">
            Posts per Page
        </label>
        <select id="posts-amount" class="bg-neutral-900 text-center" on:change={setPosts}>            
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
        </select>
    </div>
    <div class="flex flex-col">
        <label for="tags" class="text-orange-500">
            Tags
        </label>
        <select id="tags" class="bg-neutral-900 text-center">
            
        </select>
    </div>
</div>

<div class="flex flex-col items-center w-full relative">
    <div id="posts-titles-container" class="w-full h-full flex flex-col items-center overflow-visible">
        <div id="posts" class="w-full flex flex-col items-center md:w-3/4 bg-black mt-32 mb-20" style="border-radius: 20px;">
        </div>
    </div>
</div>