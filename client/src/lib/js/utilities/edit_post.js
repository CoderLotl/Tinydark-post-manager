import { DataAccessFetch } from "../services/DataAccessFetch.js";

let dataAccess = new DataAccessFetch();

export async function SavePostChanges(postContent)
{
    let payload = postContent;
    let serverResponse = await dataAccess.putData('http://localhost:8000/posts/save_post_changes', payload);
    if(serverResponse)
    {
        if(serverResponse.ok)
        {
            console.log(':D');
        }
    }
    else
    {
        
    }
}