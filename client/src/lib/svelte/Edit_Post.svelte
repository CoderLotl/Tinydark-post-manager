<script>
    import Quill from 'quill';    
    import { onMount } from 'svelte';        
    import { GoBack } from '../js/utilities/backbtn';
    import { SavePostChanges } from '../js/utilities/edit_post.js';
    import { StorageManager } from '../js/services/StorageManager.js';
    import Home_header from './components/Home_header.svelte';
    
    let storageManager = new StorageManager();
    let postContent = JSON.parse(storageManager.ReadSS('post'));

    let quill;
    let quill2;
    let quill3;
    let quill4;

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
        quill4 = new Quill('#url-editor');

        quill.root.innerHTML = postContent.content;
        quill2.root.innerHTML = postContent.headline;
        quill3.root.innerHTML = postContent.game;
        quill4.root.innerHTML = postContent.url;

        window.addEventListener('click', ()=>
        {            
            let dialog = document.getElementById('dialog');
            if(dialog.classList.contains('flex'))
            {                
                dialog.classList.remove('flex');                
            }
        });
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
        <button on:click={GoBack}>
            Go Back
        </button>
    </div>
</Home_header>

<div class="editor-container mt-40 relative flex flex-col items-center rounded-3xl">
    <fieldset id="details-fieldset" class="flex flex-col w-3/4 px-3 border border-solid rounded-3xl mt-6 bg-slate-800">
        <legend class="text-base">
            Post Details
        </legend>
        <div id="first-row-details" class="flex justify-between">
            <div class="w-3/5">
                <label for="title-editor" class="text-lg">
                    Title
                </label>
                <div id="title-editor" class="editor w-full rounded-3xl px-6 italic">
    
                </div>
            </div>
            <div class="w-1/5">
                <label for="game-editor" class="text-lg">
                    Tag
                </label>
                <div id="game-editor" class="editor w-full rounded-3xl pl-3 pr-0 md:pl-3 italic">
    
                </div>
            </div>
        </div>
        <div id="second-row-details">
            <div class="w-3/5">
                <label for="url-editor" class="text-lg">
                    URL
                </label>
                <div id="url-editor" class="editor w-full rounded-3xl px-6 italic">
    
                </div>
            </div>
        </div>
    </fieldset>    
    <fieldset id="post-content-fieldset" class="flex flex-col items-center w-3/4 border border-solid rounded-3xl mt-6 pl-3 pr-3 bg-slate-800">
        <legend class="text-base">
            Post content
        </legend>
        <fieldset id="toolbar" class="flex justify-center w-full border border-solid my-6">
            <div id="toolbar" class="my-2">
                <button class="ql-bold td-button">B</button>
                <button class="ql-italic td-button">I</button>
                <button class="ql-underline td-button">U</button>
                <button class="ql-link td-button">Link</button>
            </div>
        </fieldset>
        <div id='post-editor' class="h-min-full w-full rounded-3xl p-6 my-6 editor">
        
        </div>
        <div class="mb-6">
            <button on:click={GoBack}>
                Go Back
            </button>
            <button on:click={handleSavingPostChanges}>
                Save Changes
            </button>
        </div>
    </fieldset>
</div>

<dialog id="dialog" class="flex-col w-full md:w-2/5 h-2/5 border rounded-3xl items-center z-[999] top-1/2 md:top-1/4 bg-[#0e7b2fb5]">    
    <div id="dialogContent" class="flex flex-col items-center justify-center w-full h-full">
        <img id="server-response" alt="server response" width="62p" height="62p">
        <p id="server-message" class="text-white">

        </p>
    </div>    
</dialog>