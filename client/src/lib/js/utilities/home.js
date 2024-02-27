import { navigate } from 'svelte-routing';
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
    
    let serverResponse = await dataAccess.postData('http://localhost:8000/login', payload);
        if (serverResponse)
        {            
            let resp = await serverResponse.json();
            
            if(serverResponse.ok)
            {                
                let svResponse = JSON.parse(resp['response']);
                
                if (svResponse.hasOwnProperty('token'))
                {                                    
                    blob.style.visibility = 'visible';
                    storageManager.WriteLS('user', user.value);
                    setTimeout(() => {
                        blob.style.visibility = 'hidden';
                        navigate('/home');
                    }, 2000);                
                }
            }
            else
            {
                message.textContent = 'Error: ' + resp['response'];
            }
        }
        else
        {
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

export async function CheckIfLoggedIn()
{
    let serverResponse = await dataAccess.postData('http://localhost:8000/check_logged_in', '');
    if(serverResponse)
    {
        let resp = await serverResponse.json();
        if(serverResponse.ok)
        {            
            return { success: true, username: resp['response'] };
        }
        else
        {
            return { success: false };
        }        
    }
    else
    {
        console.log(serverResponse);
        return false;
    }
}

export async function GeneratePageButtons()
{
    let pageButtons = document.getElementById('page_buttons');
    let payload = { posts_per_page: 5 };
    let serverResponse = await dataAccess.getData('http://localhost:8000/posts/pages_count', payload);
    
    if(serverResponse)
    {
        let resp = await serverResponse.json();
        let pages = JSON.parse(resp['response']);

        for(let i = 0; i < pages; i++)
        {
            let btn = document.createElement('button');
            btn.classList.add('page_number_bottom', 'num');
            btn.value = i + 1;
            btn.textContent = i + 1;

            if(btn.value == 1)
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

export async function GeneratePosts()
{
    posts = await GetPosts(1, 5);
    let container = document.getElementById('posts');
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

        // let contentDiv2 = dynamicDrawer.CreateDiv(null, 'relative flex-grow max-w-full flex-1 px-4 pl-0 blogpost');
        // contentDiv2.innerHTML = posts[i].content;
        // contentDiv1.appendChild(contentDiv2);

        previewBtn.addEventListener('click', async ()=>
        {
            let post = await GetPostContent(postContainer);
            let dialogContent = document.getElementById('dialogContent');
            if(post)
            {                
                dialogContent.innerHTML = post.content;
                dialog.open = true;
                document.getElementById('dialog').style.display = 'flex';
            }
        });

        if(i < posts.length )
        {
            let hr = dynamicDrawer.CreateHR(null, 'blogpost_hr my-2');
            hr.setAttribute('data-tag', CapitalizeFirstLetter(posts[i].game));
            container.insertBefore(hr, navBottom);
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