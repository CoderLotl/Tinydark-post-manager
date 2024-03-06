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
            btn.classList.add('page_number_bottom', 'num');
            btn.value = i + 1;
            btn.textContent = i + 1;

            if(btn.value == page)
            {
                btn.disabled = 'disabled';
            }

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
            let postContainer = dynamicDrawer.CreateDiv(null, 'container py-2 px-0 sm:px-1 blog');
            postContainer.setAttribute('data-tag', CapitalizeFirstLetter(posts[i].game));        
            postContainer.setAttribute('post-attributes', JSON.stringify({game: posts[i].game, headline: posts[i].headline }));
            container.insertBefore(postContainer, navBottom);
    
            let div1 = dynamicDrawer.CreateDiv(null, 'flex flex-wrap mb-2');
            postContainer.appendChild(div1);
    
            let div2 = dynamicDrawer.CreateDiv(null, 'blog_header w-full md:w-4/6 text-center sm:text-left');
            div1.appendChild(div2);
            
            let h2 = dynamicDrawer.CreateH(2, posts[i].headline);
            div2.appendChild(h2);
    
            let div3 = dynamicDrawer.CreateDiv(null, 'w-full mt-2 text-center md:mt-0 md:w-2/6 md:text-right');
            div3.textContent = dateFormatter.formatDate(posts[i].date);
            div1.appendChild(div3);
    
            let contentDiv1 = dynamicDrawer.CreateDiv(null, 'flex flex-col items-center');
            contentDiv1.style = 'overflow: auto;';
            postContainer.appendChild(contentDiv1);
    
            let previewBtn = document.createElement('button');
            previewBtn.textContent = 'Preview';
            previewBtn.className = 'max-w-min';
            contentDiv1.appendChild(previewBtn);
    
            AddPreviewBtnMechanic(previewBtn, postContainer);
    
            if(i < posts.length )
            {
                let hr = dynamicDrawer.CreateHR(null, 'blogpost_hr my-2');
                hr.setAttribute('data-tag', CapitalizeFirstLetter(posts[i].game));
                container.insertBefore(hr, navBottom);
            }
        }
    }
}

async function GetPostContent(postContainer)
{    
    let params = JSON.parse(postContainer.getAttribute('post-attributes'));
    let serverResponse = await dataAccess.getData('http://localhost:8000/posts/post', params);
    if(serverResponse)
    {
        let resp = await serverResponse.json();        
        return resp['response'][0];
    }
}

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
            dialog.open = true;
            document.getElementById('dialog').style.display = 'flex';
        }
    });
}

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

// ------------------------------------

function CapitalizeFirstLetter(string)
{
    return string[0].toUpperCase() + string.slice(1);
}