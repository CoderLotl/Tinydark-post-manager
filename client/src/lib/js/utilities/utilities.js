import { DataAccessFetch } from "../services/DataAccessFetch.js";
import { StorageManager } from "../services/StorageManager.js";
import { BACK_PATH, BASE_PATH } from "../stores/stores.js";
import { get } from 'svelte/store';

let dataAccess = new DataAccessFetch();
let storageManager = new StorageManager();

export function GoBack(event)
{
    event.preventDefault();
    history.back();
}

export async function CheckIfLoggedIn()
{
    let BACK_PATH_ = get(BACK_PATH);
    
    let serverResponse = await dataAccess.postData(`${BACK_PATH_}` + '/verify/token', null, true, false);
    if(serverResponse && serverResponse.ok)
    {        
        return true;
    }
    else
    {
        return false;
    }
}

export function ShowDialog(message = false, innerHTML = false)
{
    let messageArea = document.getElementById('server_message');
    let response = document.getElementById('server_message_content');
    response.innerHTML = '';
    response.textContent = '';

    if(message)
    {
        response.textContent = message;
    }
    else
    {
        response.appendChild(innerHTML);
    }

    messageArea.classList.remove('hidden');
    messageArea.className += ' flex bg-green-500 p-4 rounded-md';
}

export function AddDismissDialogMechanic(dialogID, exceptionElement)
{
    window.addEventListener('click', (event)=>
    {
        let dialog = document.getElementById(`${dialogID}`);

        if(Array.isArray(exceptionElement))
        {
            let exElements = [];
            for(let i = 0; i < exceptionElement.length; i++)
            {
                exElements.push(document.getElementById(`${exceptionElement[i]}`));
            }

            let isPresent = exElements.some(element => element === event.target);
            if(!isPresent)
            {
                if(!dialog.classList.contains('hidden'))
                {               
                    dialog.classList.add('hidden');
                }
            }
        }
        else
        {
            let exElement = document.getElementById(`${exceptionElement}`);
            if(event.target !== exElement)
            {            
                if(!dialog.classList.contains('hidden'))
                {               
                    dialog.classList.add('hidden');
                }
            }
            return;
        }
    });
}