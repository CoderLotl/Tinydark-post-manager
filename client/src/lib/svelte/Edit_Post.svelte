<script>
    import Quill from 'quill';    
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { navigate } from 'svelte-routing';
    import { APP_NAME, BASE_PATH } from "../js/stores/stores.js";    
    import { SavePostChanges, AddDismissDialogMechanic, AddGameTagsMechanic, LoadTags } from '../js/utilities/edit_post.js';
    import { StorageManager } from '../js/services/StorageManager.js';
    import Header from './components/Header.svelte';
    import Main from './components/Main.svelte';
    import Footer from './components/Footer.svelte';

    $: APP_NAME_ = $APP_NAME;
    
    let storageManager = new StorageManager();
    let postContent = JSON.parse(storageManager.ReadSS('post'));
    let newPost = storageManager.ReadSS('createPost') == 'false' ? false : true;
    storageManager.RemoveSS('tags');

    let quill;
    let quill2;
    let quill3;

    let tabIndexes = [];

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
        quill3 = new Quill('#url-editor');

        if(newPost == false)
        {
            quill.root.innerHTML = postContent.content;
            quill2.root.innerHTML = postContent.headline;            
            quill3.root.innerHTML = postContent.url;
            LoadTags(postContent.game);
        }
        
        let ql_editors = document.querySelectorAll('.ql-editor');
        tabIndexes.push({element: ql_editors[0].getElementsByTagName('p')[0], index: 1});
        tabIndexes.push({element: ql_editors[1].getElementsByTagName('p')[0], index: 2});
        tabIndexes.push({element: document.getElementById('game-editor'), index: 3});
        tabIndexes.push({element: ql_editors[2].getElementsByTagName('p')[0], index: 4});
        tabIndexes.push({element: document.getElementById('goBack_btn'), index: 5});
        tabIndexes.push({element: document.getElementById('save_changes_btn'), index: 6});


        ql_editors[0].getElementsByTagName('p')[0].tabIndex = 1;
        ql_editors[1].getElementsByTagName('p')[0].tabIndex = 2;        
        ql_editors[2].getElementsByTagName('p')[0].tabIndex = 4;

        //console.log(tabIndexes.length);
        for(let i = 0; i < tabIndexes.length; i++)
        {
            tabIndexes[i].element.addEventListener('keydown', (event)=>
            {
                let this_index = tabIndexes[i].index;
                if(event.key == 'Tab')
                {                    
                    event.preventDefault();
                    for(let j = 0; j < tabIndexes.length; j++)
                    {
                        if(tabIndexes[j].index == this_index + 1)
                        {
                            tabIndexes[j].element.focus();
                            return;
                        }
                    }
                    tabIndexes[0].element.focus();
                }
            });            
        }

        AddDismissDialogMechanic();
        AddGameTagsMechanic();
    });
    

    function goBack(event)
    {
        storageManager.RemoveSS('tags');
        storageManager.RemoveSS('post');
        GoBack(event);
    }

    function handleSavingPostChanges()
    {
        let newPostContent;

        if(postContent != null)
        {
            newPostContent =
            {
                content: quill.root.innerHTML,
                headline: quill2.getText().trim(),
                game: JSON.parse(storageManager.ReadSS('tags')),
                url: quill3.getText().trim(),
                id: postContent.id
            };
        }
        else
        {
            newPostContent =
            {
                content: quill.root.innerHTML,
                headline: quill2.getText().trim(),
                game: JSON.parse(storageManager.ReadSS('tags')),
                url: quill3.getText().trim(),
            };
        }
        storageManager.RemoveSS('post');
        SavePostChanges(newPostContent, newPost);
    }

    function GoBack(event)
    {
        event.preventDefault();
        let BASE_PATH_ = get(BASE_PATH);
        navigate(`${BASE_PATH_}` + '/home');
    }
</script>

<svelte:head>
    <title>{APP_NAME_} - Edit Post</title>
</svelte:head>

<Header>
    <div class="flex flex-col items-center">
        <button on:click={goBack}>
            Go Back
        </button>
    </div>
</Header>
<Main>
    <fieldset id="details-fieldset" class="flex flex-col w-full md:w-3/4 px-3 border border-solid rounded-3xl mt-[120px] bg-slate-800">
        <legend class="text-base">
            Post Details
        </legend>
        <div id="first-row-details" class="flex flex-col">
            <div class="w-full md:w-3/5">
                <label for="title-editor" class="text-lg">
                    Title
                </label>
                <div id="title-editor" class="editor w-full rounded-3xl px-6 italic">
    
                </div>
            </div>
            <div class="w-full md:w-3/5">
                <label for="url-editor" class="text-lg">
                    URL
                </label>
                <div id="url-editor" class="editor w-full rounded-3xl px-6 italic">
    
                </div>
            </div>
        </div>
        <div id="second-row-details" class="mb-4">
            <div class="w-full md:w-3/4 flex flex-col">
                <label for="game-editor" class="text-lg">
                    Tag
                </label>
                <div id="element-tags" class="flex flex-wrap w-ful mb-2">
                </div>
                <input type="text" tabindex="3" placeholder="Write some tag name here" id="game-editor" class="editor w-3/5 md:w-1/2 rounded-3xl pr-0 pl-3 md:pl-3 italic">
            </div>
        </div>
    </fieldset>    
    <fieldset id="post-content-fieldset" class="flex flex-col items-center w-full md:w-3/4 border border-solid rounded-3xl mt-6 pl-3 pr-3 bg-slate-800">
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
            <button id="goBack_btn" on:click={GoBack} tabindex="5">
                Go Back
            </button>            
            <button id="save_changes_btn" on:click={handleSavingPostChanges} tabindex="6">
                Save Changes
            </button>
        </div>
    </fieldset>

    <dialog id="dialog" class="flex-col w-full md:w-2/5 h-2/5 border rounded-3xl items-center z-[999] top-1/2 md:top-1/4">    
        <div id="dialogContent" class="flex flex-col items-center justify-center w-full h-full">
            <img id="server-response" alt="server response" width="62p" height="62p">
            <span id="server-message" class="text-white">

            </span>
        </div>    
    </dialog>
</Main>
<Footer>        
</Footer>