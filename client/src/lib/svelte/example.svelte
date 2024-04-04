<script>
    //import { CheckIfLoggedIn } from '../js/utilities/utilities.js';
    //let loggedIn = CheckIfLoggedIn();
    async function Test()
    {
        return new Promise( (resolve, reject) =>
        {
            setTimeout(() =>
            {
                console.log('a');
                resolve(true);
            }, 2000);
        });
    }    
</script>

{#await Test()}
    <div class="w-full h-full bg-slate-400">
        Waiting...
    </div>
{:then value} 
    {#if value == true}
        <div class="w-full h-full bg-slate-400">
            A
        </div>
    {:else}
        <div class="w-full h-full bg-slate-400">
            :(
        </div>
    {/if}    
{/await}