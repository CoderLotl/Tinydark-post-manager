import { navigate } from 'svelte-routing';
import { get } from 'svelte/store';
import { DataAccessFetch } from "../services/DataAccessFetch.js";
import { StorageManager } from '../services/StorageManager.js';
import { DynamicDrawer } from '../services/DynamicDrawer.js';
import { DateFormatter } from '../services/DateFormatter.js';

let dataAccess = new DataAccessFetch();
let storageManager = new StorageManager();
let dynamicDrawer = new DynamicDrawer();
let dateFormatter = new DateFormatter();

export async function Login(event) {
    event.preventDefault();

    const user = document.getElementById('user');    
    const password = document.getElementById('password');    
    const response = document.getElementById('response');
    const message = document.getElementById('message');
    const blob = document.getElementById('slime_spinner');
    
    let payload = { user: user.value, password: password.value };
    message.textContent = '';
    
    blob.style.visibility = 'visible';
    let serverResponse = await dataAccess.postData('http://localhost:8000/login', payload);
    if (serverResponse)
    {            
        let resp = await serverResponse.json();
        
        if(serverResponse.ok)
        {                
            let svResponse = JSON.parse(resp['response']);
            
            if (svResponse.hasOwnProperty('token'))
            {                
                storageManager.WriteLS('user', user.value);
                setTimeout(() => {
                    blob.style.visibility = 'hidden';
                    navigate('/home');
                }, 1000);                
            }
        }
        else
        {
            blob.style.visibility = 'hidden';
            message.textContent = 'Error: ' + resp['response'];
        }
    }
    else
    {
        blob.style.visibility = 'hidden';
        let message = 'Error contacting the server. Check your connection.';
        console.log(serverResponse);
        message.textContent = message;
    }
}

export async function Logout()
{
    let serverResponse = await dataAccess.postData('http://localhost:8000/logout');
    if(serverResponse)
    {
        storageManager.RemoveLS('user');
        navigate('/');
    }
    else
    {
        console.log(serverResponse);
    }
}

// - - - - - [ NAV BUTTONS ]

export async function GeneratePageButtons(page = 1, postsPerPage = 5)
{
    let pageButtons = document.getElementById('page_buttons');
    let payload = { posts_per_page: postsPerPage };
    let serverResponse = await dataAccess.getData('http://localhost:8000/posts/pages_count', payload);
    
    if(serverResponse)
    {
        let resp = await serverResponse.json();
        let pages = JSON.parse(resp['response']);
        pageButtons.innerHTML = '';
        
        for(let i = 0; i < pages; i++)
        {
            let btn = document.createElement('button');
            btn.classList.add('page_button', 'num');
            btn.value = i + 1;
            btn.textContent = i + 1;

            if(btn.value == page)
            {
                btn.disabled = 'disabled';
            }

            AddPaginationMechanic(btn);

            pageButtons.appendChild(btn);            
        }        
    }
    else
    {
        console.log('Error contacting the server.');
        console.log(serverResponse);
        return { success: false, error: 'Error contacting the server.' };
    }
}

function AddPaginationMechanic(btn)
{
    btn.addEventListener('click', ()=>
    {
        let buttons = document.getElementsByClassName('page_button');
        let page = btn.value;
        storageManager.WriteSS('currentPage', page);
        let posts_per_page = storageManager.ReadSS('posts-per-page') || 5;

        for(let i = 0; i < buttons.length; i++)
        {
            if(buttons[i].hasAttribute('disabled'))
            {
                buttons[i].removeAttribute('disabled');
            }
        }

        btn.setAttribute('disabled', "");

        GeneratePosts(page, posts_per_page);
    });
}

// - - - - - [ TAGS & POSTS PER PAGE ]

export async function GetTags()
{
    let tagsSelect = document.getElementById('tags');
    let defaultOption = document.createElement('option');
    defaultOption.textContent = 'All';
    defaultOption.value = 'All';
    tagsSelect.appendChild(defaultOption);

    let serverResponse = await dataAccess.getData('http://localhost:8000/posts/get_tags');
    if(serverResponse)
    {
        let resp = await serverResponse.json();
        let options = resp['response'];
        for(let i = 0; i < options.length; i++)
        {
            let opt = document.createElement('option');
            opt.textContent = options[i];
            opt.value = options[i];
            tagsSelect.appendChild(opt);
        }
    }
}

export async function SetPostsPerPage(postsPerPage)
{
    let select = document.getElementById('posts-amount');
    let selectedIndex;
    switch(postsPerPage)
    {
        case '5':
            selectedIndex = 0;
            break;
        case '10':
            selectedIndex = 1;
            break;
        case '15':
            selectedIndex = 2;
            break;
    }
    select.selectedIndex = selectedIndex;
}

export async function GeneratePosts(page = 1, postsPerPage = 5)
{
    let container = document.getElementById('posts');
    let posts = await GetPosts(page, postsPerPage);
    if(posts)
    {
        container.innerHTML = '';
        let navBottom = container.children[0];
    
        for(let i = 0; i < posts.length; i++)
        {            
            // POST CONTAINER
            let postContainer = dynamicDrawer.CreateDiv(null, 'flex w-full py-4 md:py-10 px-4 md:px-28 justify-between');
            postContainer.setAttribute('data-tag', CapitalizeFirstLetter(posts[i].game));        
            postContainer.setAttribute('post-attributes', JSON.stringify({game: posts[i].game, headline: posts[i].headline, object_id: posts[i].object_id }));
            container.insertBefore(postContainer, navBottom);
    
            // POST DATA
            let div1 = dynamicDrawer.CreateDiv(null, 'flex flex-wrap mb-2 w-3/5');
            postContainer.appendChild(div1);
            
            // POST HEADLINE AND DETAILS
            let div2 = dynamicDrawer.CreateDiv(null, 'blog_header w-full md:w-4/6 text-center sm:text-left');
            div1.appendChild(div2);
            
            // POST HEADLINE CONTENT
            let h2 = dynamicDrawer.CreateH(2, posts[i].headline);
            div2.appendChild(h2);

            // SUB DETAILS 1
            let sub1 = dynamicDrawer.CreateDiv(null, null);
            div2.appendChild(sub1);

            let span1 = dynamicDrawer.CreateSpan(null, 'TAG: ');
            span1.classList = 'font-bold'
            sub1.appendChild(span1);

            let tag = dynamicDrawer.CreateSpan(null, posts[i].game);            
            tag.classList = 'italic';
            sub1.appendChild(tag);

            // SUB DETAILS 2
            let sub2 = dynamicDrawer.CreateDiv(null, null);
            div2.appendChild(sub2);

            let span2 = dynamicDrawer.CreateSpan(null, 'URL: ');
            span2.classList = 'font-bold'
            sub2.appendChild(span2);

            let url = dynamicDrawer.CreateSpan(null, posts[i].url);      
            url.classList = 'italic';
            sub2.appendChild(url);
            
            // POST DATE
            let div3 = dynamicDrawer.CreateDiv(null, 'w-full mt-2 text-center md:mt-0 md:w-2/6 md:text-right');
            div3.textContent = dateFormatter.formatDate(posts[i].date);
            div1.appendChild(div3);
            
            // POST FUNCTIONS
            let contentDiv1 = dynamicDrawer.CreateDiv(null, 'flex flex-col items-center');
            contentDiv1.style = 'overflow: auto;';
            postContainer.appendChild(contentDiv1);
            

            // PREVIEW FUNCTION
            let previewBtn = document.createElement('button');
            previewBtn.textContent = 'Preview';
            previewBtn.className = 'w-full rounded-xl';
            contentDiv1.appendChild(previewBtn);

            // EDIT FUNCTION
            let editBtn = document.createElement('button');
            editBtn.textContent = 'Edit';
            editBtn.className = 'w-full rounded-xl mt-3';
            contentDiv1.appendChild(editBtn);

            // DELETE FUNCTION
            let deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'w-full rounded-xl mt-3';
            contentDiv1.appendChild(deleteBtn);
    
            AddPreviewBtnMechanic(previewBtn, postContainer);
            AddEditBtnMechanic(editBtn, postContainer);
            AddDeleteBtnMechanic(deleteBtn, postContainer);
    
            if(i < posts.length )
            {
                let hr = dynamicDrawer.CreateHR(null, 'blogpost_hr my-2');
                hr.setAttribute('data-tag', CapitalizeFirstLetter(posts[i].game));
                container.insertBefore(hr, navBottom);
            }
        }
    }
}

export async function GetPosts(page, amount)
{
    let payload = {page: page, posts_amount: amount}
    let serverResponse = await dataAccess.getData('http://localhost:8000/posts/posts_content', payload);
    if(serverResponse)
    {
        let resp = await serverResponse.json();        
        return resp['response'];
    }
}

/**
 * Retrieves some of the post's attributes stored as properties in a HTML element.
 * Uses those attributes GET the post from the back and return the whole post.
 * @param {*} postContainer 
 * @returns array || false
 */
async function GetPostContent(postContainer)
{    
    let params = JSON.parse(postContainer.getAttribute('post-attributes'));
    let serverResponse = await dataAccess.getData('http://localhost:8000/posts/post', params);
    if(serverResponse)
    {
        let resp = await serverResponse.json();        
        return resp['response'][0];
    }
    return false;
}

// - - - - - [ POST BUTTONS ]

function AddPreviewBtnMechanic(btn, postContainer)
{
    btn.addEventListener('click', async ()=>
    {
        let post = await GetPostContent(postContainer);
        let dialogContent = document.getElementById('dialogContent');
        let dialogTitle = document.getElementById('dialog-title');
        if(post)
        {            
            dialogTitle.textContent = `"${post.headline} - ${post.date}"`;
            dialogContent.setAttribute('post-attributes', JSON.stringify({game: post.game, headline: post.headline, object_id: post.object_id, url: post.url }));
            dialogContent.innerHTML = post.content;                        
            document.getElementById('dialog').style.display = 'flex';
        }
    });
}

async function AddEditBtnMechanic(btn, postContainer)
{
    btn.addEventListener('click', async ()=>
    {
        let postContent = await GetPostContent(postContainer);
        storageManager.WriteSS('post',JSON.stringify(postContent));
        navigate('/edit_post');
    });
}

async function AddDeleteBtnMechanic(btn, postContainer)
{
    btn.addEventListener('click', async ()=>
    {
        let postAttributes = JSON.parse(postContainer.getAttribute('post-attributes'));
        document.getElementById('confirm-dialog').style.display = 'grid';
        storageManager.WriteSS('delete-post', postAttributes.object_id);
    });
}

// - - - - - [ EDIT DIALOG BUTTONS ]

export function EditPost()
{
    let dialogContent = document.getElementById('dialogContent');
    let postAttributes = JSON.parse(dialogContent.getAttribute('post-attributes'));
    postAttributes.content = dialogContent.innerHTML;
    storageManager.WriteSS('post',JSON.stringify(postAttributes));
    navigate('/edit_post');
}

export function CloseDialog()
{
    let dialog = document.getElementById('dialog');
    dialog.style.display = '';
    dialog.close();
}

// - - - - - [ DELETE DIALOG BUTTONS ]

export function CloseDeleteDialog()
{
    document.getElementById('confirm-dialog').style.display = '';    
}

export async function ConfirmDeleteDialog()
{
    let object_id = storageManager.ReadSS('delete-post');
    let payload = {object_id: object_id};
    if(object_id)
    {
        let serverResponse = await dataAccess.deleteData('http://localhost:8000/posts/delete_post', payload);
    }
}

// ------------------------------------

function CapitalizeFirstLetter(string)
{
    return string[0].toUpperCase() + string.slice(1);
}