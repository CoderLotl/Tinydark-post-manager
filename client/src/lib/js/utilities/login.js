// @ts-nocheck
import { navigate } from 'svelte-routing';
import { DataAccessFetch } from "../services/DataAccessFetch.js";
import { StorageManager } from '../services/StorageManager.js';
import { BACK_PATH, BASE_PATH } from "../stores/stores.js";
import { get } from 'svelte/store';

let dataAccess = new DataAccessFetch();
let storageManager = new StorageManager();

export async function Login(event)
{
    event.preventDefault();
    let BACK_PATH_ = get(BACK_PATH);
    let BASE_PATH_ = get(BASE_PATH);

    const user = document.getElementById('user');
    const isDev = import.meta.env.MODE;
    let password = isDev ? false : document.getElementById('password');    
    const response = document.getElementById('response');
    const message = document.getElementById('message');
    const blob = document.getElementById('slime_spinner');
    
    let payload = { user: user.value, password: password.value };
    message.textContent = '';    
    blob.style.visibility = 'visible';    
    
    let serverResponse;
    try
    {
        serverResponse = await dataAccess.postData(`${BACK_PATH_}` + '/login', payload, true, true);
        if(serverResponse)
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
                        navigate(`${BASE_PATH_}` + '/home');
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
            message.textContent = msg;
        }
    }
    catch(error)
    {
        blob.style.visibility = 'hidden';
        let msg = 'Undefined Error contacting the server. Check your connection.';
        console.log(error);
        message.textContent = msg;
    }
}

export async function Logout()
{
    let BACK_PATH_ = get(BACK_PATH);
    let BASE_PATH_ = get(BASE_PATH);
    let serverResponse = await dataAccess.postData(`${BACK_PATH_}` + '/logout');
    if(serverResponse)
    {
        storageManager.RemoveLS('user');
        navigate(`${BASE_PATH_}` + '/');
    }
    else
    {
        console.log(serverResponse);
    }
}
