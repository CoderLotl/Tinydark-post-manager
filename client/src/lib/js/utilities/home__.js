import { navigate } from 'svelte-routing';
import { DataAccessFetch } from "../services/DataAccessFetch.js";
import { DynamicDrawer } from '../services/DynamicDrawer.js';
import { DateFormatter } from '../services/DateFormatter.js';

let dataAccess = new DataAccessFetch();
let dynamicDrawer = new DynamicDrawer();
let dateFormatter = new DateFormatter();

export async function Login()
{
    const user = document.getElementById('user');    
    const password = document.getElementById('password');
    
    let payload = { user: user.value, password: password.value };
    
    let serverResponse = await dataAccess.postData('http://localhost:8000/login', payload);
    if (serverResponse)
    {            
        let resp = await serverResponse.json();
        
        if(serverResponse.ok)
        {                
            let svResponse = JSON.parse(resp['response']);
            
            if (svResponse.hasOwnProperty('token'))
            {                                    
                console.log('Token: ' + svResponse['token']);
                return { success: true, username: user.value };
            }
        }
        else
        {
            console.log('Error: ' + resp['response']);
            return { success: false, error: resp['response'] };
        }
    }
    else
    {
        console.log('Error contacting the server.');
        console.log(serverResponse);
        return { success: false, error: 'Error contacting the server.' };
    }
}

export async function Logout()
{    
    let serverResponse = await dataAccess.postData('http://localhost:8000/logout');
    if(serverResponse == true)
    {
        return true;
    }
    else
    {
        console.log(serverResponse);
        return false;
    }
}

export function showModal()
{
    var modal = document.querySelector('.modal-open');
    modal.checked = true;
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

export async function GetPosts()
{
    let payload = {page: 1, posts_amount: 5}
    let serverResponse = await dataAccess.postData('http://localhost:8000/posts/posts_content', payload);
    if(serverResponse)
    {
        let resp = await serverResponse.json();
        console.log(resp['response']);
        GeneratePosts(resp['response']);
    }
}

export async function GeneratePageButtons()
{
    let pageButtons = document.getElementById('page_buttons');
    let bottomButtons = document.getElementById('bottom_buttons');

    let payload = { posts_per_page: 5 };
    let serverResponse = await dataAccess.postData('http://localhost:8000/posts/pages_count', payload);
    
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

            let btnBottom = btn.cloneNode(true);

            pageButtons.appendChild(btn);
            bottomButtons.appendChild(btnBottom);
        }        
    }
    else
    {
        console.log('Error contacting the server.');
        console.log(serverResponse);
        return { success: false, error: 'Error contacting the server.' };
    }
}

function CapitalizeFirstLetter(string)
{
    return string[0].toUpperCase() + string.slice(1);
}

function GeneratePosts(posts)
{
    let container = document.getElementById('news');
    let navBottom = container.children[0];

    for(let i = 0; i < posts.length; i++)
    {
        let postContainer = dynamicDrawer.CreateDiv(null, 'container py-2 px-0 sm:px-1 blog');
        postContainer.setAttribute('data-tag', CapitalizeFirstLetter(posts[i].game));
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

        let contentDiv1 = dynamicDrawer.CreateDiv(null, 'flex flex-wrap mx-1 bloghold');        
        contentDiv1.style = 'overflow: auto;';
        postContainer.appendChild(contentDiv1);

        let contentDiv2 = dynamicDrawer.CreateDiv(null, 'relative flex-grow max-w-full flex-1 px-4 pl-0 blogpost');
        contentDiv2.innerHTML = posts[i].content;
        contentDiv1.appendChild(contentDiv2);

        if(i < posts.length )
        {
            let hr = dynamicDrawer.CreateHR(null, 'blogpost_hr my-2');
            hr.setAttribute('data-tag', CapitalizeFirstLetter(posts[i].game));
            container.insertBefore(hr, navBottom);
        }
    }
}
/*
<div class="container py-2 px-0 sm:px-1 blog" data-tag="Studio">
    <div class="flex flex-wrap mb-2">
        <div class="blog_header w-full md:w-4/6 text-center sm:text-left">
            <h2 class="mb-0 hidden sm:inline-block"><a
                    href="https://tinydark.com/blog/into-the-tiny-dark">Into The Tiny
                    Dark</a></h2>
            <h3 class="mb-0 sm:hidden inline-block"><a
                    href="https://tinydark.com/blog/into-the-tiny-dark">Into The Tiny
                    Dark</a></h3>
        </div>

        <div class="w-full mt-2 text-center md:mt-0 md:w-2/6 md:text-right">
            November 8th, 2022 23:24 EST
        </div>
    </div>								

    <div class="flex flex-wrap mx-1 bloghold" style="overflow: auto; ">
        <div class="relative flex-grow max-w-full flex-1 px-4 pl-0 blogpost">
            <p>I'll
                close out by saying the volunteer effort has gone well so far, and it's
                great just having players in the engine making the actual game, no code
                required. I'm very appreciative of their efforts. And we're only a
                small group of people! I haven't marketed or really spread the word
                myself. Whether you're no longer active or still active today, I'm happy
                you signed up and checked out what I've been building for so long.</p>
            <p>Until next post,<br><i>Vael</i></p>
        </div>
    </div>
</div>

<hr class="blogpost_hr my-2" data-tag="Studio">*/