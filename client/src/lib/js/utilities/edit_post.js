import { navigate } from "svelte-routing";
import { DataAccessFetch } from "../services/DataAccessFetch.js";
import { DynamicDrawer } from "../services/DynamicDrawer.js";
import { StorageManager } from "../services/StorageManager.js";
import { BACK_PATH, BASE_PATH } from "../stores/stores.js";
import { get } from 'svelte/store';
import checked from '../../../assets/checked.png';
import error from '../../../assets/error.png';
import error_net from '../../../assets/error_net.png';

let dataAccess = new DataAccessFetch();
let dynamicDrawer = new DynamicDrawer;
let storageManager = new StorageManager;

export async function SavePostChanges(postContent, isNewPost)
{
    let BACK_PATH_ = get(BACK_PATH);
    let BASE_PATH_ = get(BASE_PATH);
    let payload = postContent;
    let serverResponse;
    let postReady = false;
    let server_resp = document.getElementById('server-response');
    let server_msg = document.getElementById('server-message');
    let dialog = document.getElementById('dialog');
    let errors = [];    

    if(postContent.headline.trim() == '')
    {
        errors.push('- Set the TITLE for this post.');        
    }

    if(postContent.game == null || postContent.game.length == 0)
    {
        let tagInput = document.getElementById('game-editor').value.trim();         
        if(tagInput == '')
        {
            errors.push('- Set at least one TAG for this post.');            
        }
        else
        {
            postContent.game = tagInput;
        }
    }

    let post_content = postContent.content.replace(/<[^>]*>/g, '');
    if(post_content.trim() == '')
    {
        errors.push('- Set the CONTENT for this post.');
    }

    if(errors.length == 0)
    {
        postReady = true;   
    }

    if(postReady)
    {
        if(isNewPost)
        {
            serverResponse = await dataAccess.postData(`${BACK_PATH_}` + '/posts/create_posts', payload);
        }
        else
        {
            serverResponse = await dataAccess.putData(`${BACK_PATH_}` + '/posts/save_post_changes', payload);
        }   

        if(serverResponse)
        {            
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
                dialog.style.backgroundColor = '#0e7b2fb5';
                server_msg.textContent = `${msg} Returning...`;
                setTimeout(() =>
                {
                    navigate(`${BASE_PATH_}` + '/home');
                }, 2000);
            }
            else
            {
                server_resp.src = error;
                server_resp.style.backgroundColor = 'rgb(255, 50, 0)';
                dialog.style.backgroundColor = 'rgba(255, 50, 0, 0.5)';
                server_msg.textContent = 'Error: unathorized action';
            }
        }
        else
        {            
            server_resp.src = error;
            server_resp.style.backgroundColor = 'rgb(128, 128, 128)';
            dialog.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';
            server_msg.textContent = 'Error contacting the server. Check your internet.';
        }        
    }
    else
    {
        server_resp.src = error;
        server_resp.style.backgroundColor = 'rgb(255, 50, 0)';
        dialog.style.backgroundColor = 'rgba(255, 50, 0, 0.5)';
        server_msg.textContent = '';
        server_msg.innerHTML = 'Error:<br><br>';
        for(let i = 0; i < errors.length; i++)
        {
            server_msg.innerHTML += `${errors[i]}`;
            if(i < errors.length)
            {
                server_msg.innerHTML += '<br>';
            }
        }        
    }
    dialog.classList.add('flex');    
}

export function CloseDialog()
{
    let dialog = document.getElementById('dialog');
    dialog.style.display = '';
    dialog.close();
}

export function AddDismissDialogMechanic() {
    let saveChangesBtn = document.getElementById('save_changes_btn');
    let dialog = document.getElementById('dialog');  
    
    document.addEventListener('click', (event) =>
    {
        if(!event.target.matches('#save_changes_btn'))
        {
            if(dialog.classList.contains('flex'))
            {
                dialog.classList.remove('flex');
            }
        }
    });
  }

/**
 * 
 */
export function AddGameTagsMechanic()
{
    let tagsInput = document.getElementById('game-editor');

    tagsInput.addEventListener('keydown', (event)=> // TAG INPUT MECHANIC
    {
        if(event.key == ' ' && document.activeElement == tagsInput) // If the key pressed is SPACE and the selected element is the input ...
        {
            if(tagsInput.value.trim() != '') // ... if the input ain't blank ...
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
    let elements = tags;
    storageManager.WriteSS('tags', JSON.stringify(elements));

    for(let i = 0; i < elements.length; i++)
    {
        let tag = dynamicDrawer.CreateSpan(null, elements[i]);
        tag.classList = 'italic bg-slate-300 text-black rounded-xl mx-1 px-3 cursor-pointer';
        AddTagRemoveMechanic(tag);
        elementTags.appendChild(tag);
    }    
}