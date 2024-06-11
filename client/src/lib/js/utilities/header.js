import { DataAccessFetch } from "../services/DataAccessFetch.js";
import { StorageManager } from '../services/StorageManager.js';
import { DynamicDrawer } from '../services/DynamicDrawer.js';
import { BACK_PATH } from "../stores/stores.js";
import { ShowDialog, AddDismissDialogMechanic } from './utilities.js';
import { get } from 'svelte/store';

let dataAccess = new DataAccessFetch();
let storageManager = new StorageManager();

export async function GetGameTime()
{    
    try
    {
        let gameTime = await GetTime();
        let seconds = gameTime['world_time'];
        let parsedTime = ParseTime(seconds);
        let gameTimeDisplay = document.getElementById('game_time');
        gameTimeDisplay.textContent = `Day: ${gameTime['day']} Time: ${parsedTime.hour}:${parsedTime.mins}`;
        SetGameStatus(gameTime['status']);        

        let interval = setInterval( async() =>
        {
            seconds++;
            parsedTime = ParseTime(seconds);
            if(parsedTime.secs == 0)
            {
                gameTime = await GetTime();
                seconds = gameTime['world_time'];
                parsedTime = ParseTime(seconds);
            }
            gameTimeDisplay.textContent = `Day: ${gameTime['day']} Time: ${parsedTime.hour}:${parsedTime.mins}`;            
            SetGameStatus(gameTime['status']);
        }, 1000);

        return interval;
    }
    catch(error)
    {
        console.log(error);
    }
}

function SetGameStatus(status)
{
    let gameStatus = document.getElementById('game_status');
    let stoppedColor = 'bg-red-600';
    let onlineColor = 'bg-green-500';
    if(status == 'Stopped')
    {
        gameStatus.textContent = 'Stopped';
        gameStatus.classList.add(`${stoppedColor}`);
        gameStatus.classList.remove(`${onlineColor}`);
    }
    else
    {
        gameStatus.texctContent = 'Online';
        gameStatus.classList.remove(`${stoppedColor}`);
        gameStatus.classList.add(`${onlineColor}`);
    }
}

export function ParseTime(seconds)
{
    let hour = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;
    return { hour: hour, mins: mins, secs: secs};
}

async function GetTime()
{
    let BACK_PATH_ = get(BACK_PATH);
    try
    {
        let serverResponse = await dataAccess.getData(`${BACK_PATH_}` + '/get_world_time', null, true);
        if(serverResponse)
        {
            let svResponse = await serverResponse.json();
            let worldTime = await JSON.parse(svResponse['response']);                        
            return worldTime;
        }
    }
    catch(error)
    {
        console.log(error);
    }
}