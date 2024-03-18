import { navigate } from "svelte-routing";
import { DataAccessFetch } from "../services/DataAccessFetch.js";
import { DynamicDrawer } from "../services/DynamicDrawer.js";
import { StorageManager } from "../services/StorageManager.js";
import checked from '../../../assets/checked.png';
import error from '../../../assets/error.png';
import error_net from '../../../assets/error_net.png';

let dataAccess = new DataAccessFetch();
let dynamicDrawer = new DynamicDrawer;
let storageManager = new StorageManager;

export async function SavePostChanges(postContent, isNewPost)
{
    let payload = postContent;
    let serverResponse;

    if(isNewPost)
    {
        serverResponse = await dataAccess.postData('http://localhost:8000/posts/create_posts', payload);
    }
    else
    {
        serverResponse = await dataAccess.putData('http://localhost:8000/posts/save_post_changes', payload);
    }

    let server_resp = document.getElementById('server-response');
    let server_msg = document.getElementById('server-message');        
    if(serverResponse)
    {
        document.getElementById('dialog').classList.add('flex');
        if(serverResponse.ok)
        {
            let msg;
            if(isNewPost)
            {
                msg = 'Post Created!';
            }
            else
            {
                msg = 'Post Updated!';
            }
            server_resp.src = checked;
            server_resp.style.backgroundColor = '#a8ccb2';
            server_msg.textContent = `${msg} Returning...`;
            setTimeout(() => {
                navigate('/home');
            }, 2000);
        }
        else
        {
            server_resp.src = error;
            server_resp.style.backgroundColor = 'rgb(255, 255, 255)';
            server_msg.textContent = 'Error: unathorized action';
        }
    }
    else
    {
        document.getElementById('dialog').classList.add('flex');
        server_resp.src = error;
        server_resp.style.backgroundColor = '';
        server_msg.textContent = 'Error contacting the server. Check your internet.';
    }
}

export function CloseDialog()
{
    let dialog = document.getElementById('dialog');
    dialog.style.display = '';
    dialog.close();
}

export function AddDismissDialogMechanic()
{
    window.addEventListener('click', ()=>
    {            
        let dialog = document.getElementById('dialog');
        if(dialog.classList.contains('flex'))
        {                
            dialog.classList.remove('flex');                
        }
    });
}

export function AddGameTagsMechanic()
{
    let tagsInput = document.getElementById('game-editor');
    storageManager.RemoveSS('tags');

    tagsInput.addEventListener('keydown', (event)=>
    {
        if(event.key == ' ' && document.activeElement == tagsInput)
        {
            if(tagsInput.value.trim() != '')
            {
                let tags = JSON.parse(storageManager.ReadSS('tags')) || [];
                let elementTags = document.getElementById('element-tags');
                
                if(tags.includes(tagsInput.value.trim()))
                {                    
                    tagsInput.classList.add('input-error');
                    setTimeout(() =>
                    {
                        tagsInput.classList.remove('input-error');
                    }, 1000);
                }
                else
                {
                    let tag = dynamicDrawer.CreateSpan(null, tagsInput.value);
                    tag.classList = 'italic bg-slate-300 text-black rounded-xl mx-1 px-3 cursor-pointer mb-2';
                    AddTagRemoveMechanic(tag);
                    elementTags.appendChild(tag);
    
                    tags.push(tagsInput.value);
                    storageManager.WriteSS('tags', JSON.stringify(tags));
                    tagsInput.value = '';
                }
            }
            else
            {
                tagsInput.value = '';
            }
        }
    });

    tagsInput.addEventListener('input', ()=>
    {
        tagsInput.value = tagsInput.value.trim();
    });
}

function AddTagRemoveMechanic(tag)
{
    tag.addEventListener('click', ()=>
    {
        let tags = JSON.parse(storageManager.ReadSS('tags'));
        let elementToRemove = tag.textContent;
        tags.splice(tags.indexOf(elementToRemove), 1);
        storageManager.WriteSS('tags', JSON.stringify(tags));
        tag.remove();
    });
}

export function LoadTags(tags)
{
    let elementTags = document.getElementById('element-tags');
    let elements = tags.split(", ");
    storageManager.WriteSS('tags', JSON.stringify(elements));

    for(let i = 0; i < elements.length; i++)
    {
        let tag = dynamicDrawer.CreateSpan(null, elements[i]);
        tag.classList = 'italic bg-slate-300 text-black rounded-xl mx-1 px-3 cursor-pointer';
        AddTagRemoveMechanic(tag);
        elementTags.appendChild(tag);
    }
}