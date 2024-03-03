<script>
    import Quill from 'quill';    
    import { onMount } from 'svelte';        
    import { GoBack } from '../js/utilities/backbtn';
    import { SavePostChanges } from '../js/utilities/edit_post.js';
    import { StorageManager } from '../js/services/StorageManager.js';
    import Home_header from './components/Home_header.svelte';
    
    let storageManager = new StorageManager();
    let postContent = JSON.parse(storageManager.ReadSS('post'));
    //const Delta = Quill.import('delta');
    //const Parchment = Quill.import('parchment');

    let quill;
    let quill2;
    let quill3;

    onMount( ()=>
    {        
        quill = new Quill('#post-editor',
        {
            modules:
            {
                toolbar: '#toolbar',
            }
        });
        quill2 = new Quill('#title-editor');
        quill3 = new Quill('#game-editor');

        quill.root.innerHTML = postContent.content;
        quill2.root.innerHTML = postContent.headline;
        quill3.root.innerHTML = postContent.game;
    });

    function handleSavingPostChanges()
    {
        let newPostContent =
        {
            content: quill.root.innerHTML,
            headline: quill2.getText().trim(),
            game: quill3.getText().trim(),
            object_id: postContent.object_id
        };
        
        SavePostChanges(newPostContent);
    }
</script>

<svelte:head>
    <title>Posts Manager - Edit Post</title>
</svelte:head>

<Home_header>
    <div class="flex flex-col items-center">
        <button type="button" on:click={GoBack}>
            Go Back
        </button>
    </div>
</Home_header>

<div id="editor-container" class="mt-40 relative flex flex-col items-center rounded-3xl">
    <fieldset id="details-fieldset" class="flex w-3/4 justify-between px-3 border border-solid rounded-3xl mt-6">
        <legend class="text-base">
            Post Details
        </legend>            
        <div class="w-3/5">
            <label for="title-editor">
                Title
            </label>
            <div id="title-editor" class="editor w-full">

            </div>
        </div>
        <div class="w-1/5">
            <label for="game-editor">
                Tag
            </label>
            <div id="game-editor" class="editor w-full">

            </div>
        </div>
    </fieldset>    
    <fieldset id="post-content-fieldset" class="flex flex-col items-center w-3/4 border border-solid rounded-3xl mt-6 pl-3 pr-3">
        <legend class="text-base">
            Post content
        </legend>
        <fieldset id="toolbar" class="flex justify-center w-full border border-solid my-6">
            <div id="toolbar" class="my-2">
                <button class="ql-bold">B</button>
                <button class="ql-italic">I</button>
                <button class="ql-underline">U</button>
                <button class="ql-link">Link</button>
            </div>
        </fieldset>
        <div id='post-editor' class="h-min-full w-full rounded-3xl p-6 my-6 editor">
        
        </div>
        <div class="mb-6">
            <button type="button" on:click={GoBack}>
                Go Back
            </button>
            <button type="button" on:click={handleSavingPostChanges}>
                Save Changes
            </button>
        </div>
    </fieldset>
</div>