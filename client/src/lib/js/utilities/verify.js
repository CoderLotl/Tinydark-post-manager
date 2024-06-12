import { DataAccessFetch } from "../services/DataAccessFetch";
import { BACK_PATH, BASE_PATH } from "../stores/stores.js";
import { get } from 'svelte/store';

let DataAccess = new DataAccessFetch();
const currentPath = window.location.pathname;
const parts = currentPath.split('/');
const code = parts[parts.length - 1]
let BACK_PATH_ = get(BACK_PATH);

export async function Verify()
{
    let vContent = document.getElementById('verify-content');
    let content = document.createElement('p');
    vContent.appendChild(content);
    
    let response = await DataAccess.postData(`${BACK_PATH_}` + '/verify/account', {code: code});
    if(response)
    {
        let resp = await response.json();

        if(response.ok)
        {                
            content.textContent = resp['response'];                
        }
        else
        {
            content.textContent = 'Error: ' + resp['response'];
        }
    }
    else
    {
        let message = 'Error contacting the server.';
        console.log(serverResponse);
        content.textContent = message;
    }
}