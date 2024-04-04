import { DataAccessFetch } from "../services/DataAccessFetch.js";
import { BACK_PATH, BASE_PATH } from "../stores/stores.js";
import { get } from 'svelte/store';

let dataAccess = new DataAccessFetch();
let BACK_PATH_ = get(BACK_PATH);

export function GoBack(event)
{
    event.preventDefault();
    history.back();
}

export async function CheckIfLoggedIn()
{
    let serverResponse = await dataAccess.postData(`${BACK_PATH_}` + '/check_logged_in');
    try
    {
        if(serverResponse.ok)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    catch
    {
        return false;
    }
}