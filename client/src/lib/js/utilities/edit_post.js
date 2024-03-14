import { navigate } from "svelte-routing";
import { DataAccessFetch } from "../services/DataAccessFetch.js";
import checked from '../../../assets/checked.png';
import error from '../../../assets/error.png';
import error_net from '../../../assets/error_net.png';

let dataAccess = new DataAccessFetch();

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
            server_resp.src = checked;
            server_resp.style.backgroundColor = '#a8ccb2';
            server_msg.textContent = 'Post updated! Returning...';
            setTimeout(() => {
                navigate('/home');
            }, 2000);
        }
        else
        {
            server_resp.src = error;
            server_resp.style.backgroundColor = 'rgb(255, 255, 255)';
            server_msg.textContent = 'Error: action unathorized';
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
