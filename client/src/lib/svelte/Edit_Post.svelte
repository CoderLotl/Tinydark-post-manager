<script>
    import Quill from 'quill';
    //import { Delta } from 'quill';
    import { onMount } from 'svelte';        
    import { GoBack } from '../js/utilities/backbtn';
    import { StorageManager } from '../js/services/StorageManager.js';
    import Home_header from './components/Home_header.svelte';
    
    let storageManager = new StorageManager();
    let postContent = storageManager.ReadSS('post-content');    
    //const Delta = Quill.import('delta');
    //const Parchment = Quill.import('parchment');

    onMount( ()=>
    {        
        const quill = new Quill('#editor',
        {
            modules:
            {
                toolbar: '#toolbar',
            }
        });
        quill.root.innerHTML = postContent;        
    });
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
    <div id="toolbar" class="my-6">
        <button class="ql-bold">B</button>
        <button class="ql-italic">I</button>
        <button class="ql-underline">U</button>
        <button class="ql-link">Link</button>
    </div>
    <div id='editor' class="h-min-full w-3/4  rounded-3xl p-6 mb-6">
    
    </div>
</div>