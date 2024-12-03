<script>    
    import { navigate } from 'svelte-routing';
    import { BASE_PATH, APP_NAME } from "../js/stores/stores.js";
    import { get } from 'svelte/store';
    import { Login } from '../js/utilities/login.js';    

    import Main from './components/Main.svelte';
    import Footer from './components/Footer.svelte';

    import blob from '../../assets/2022_sm_002.png';

    $: APP_NAME_ = $APP_NAME;
    
    const isDev = import.meta.env.MODE == 'development' ? true : false;    

    function NavToRegister(event)
    {
        event.preventDefault();
        let BASE_PATH_ = get(BASE_PATH);
        navigate(`${BASE_PATH_}` + '/register');
    }    
</script>

<svelte:head>
    <title>{APP_NAME_} - Login</title>
</svelte:head>

<Main>
    <form id="form-login"
    class="flex flex-col items-center rounded-md border-0 w-1/2 lg:w-2/6 lg:h-3/5 min-h-min overflow-auto p-4 bg-slate-900/60 mt-20"
    >
        <div class="w-full flex justify-center bg-[#0C0A0A]">
            <p class="font-['Fjord_One'] text-2xl font-bold text-slate-200 pt-4">
                Log In
            </p>
        </div>
        <div class="flex flex-col mt-4">
            <label for="user">
                Login Name:
            </label>
            <input id="user" type="text" placeholder="Username" autocomplete="off" class="bg-gray-900 rounded-lg text-gray-200 mt-1 mb-2 pl-3">
            {#if !isDev}
                <label for="password">
                    Password:
                </label>
                <input id="password" type="password" placeholder="Password" autocomplete="off" class="bg-gray-900 rounded-lg text-gray-200 mt-1 mb-2 pl-3">
            {/if}
        </div>

        <div class="flex flex-col">
            <button on:click={Login}
                class="
                m-2 px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-500 shadow-[0_4px_rgba(5,5,59,1)] 
                hover:shadow-[0_4px_rgba(133,133,231,1)] active:translate-y-[4px] active:shadow-[0_0_rgb(133,133,231)] active:transition duration-100
                font-bold text-slate-200"
            >
                Log In
            </button>            
            <button on:click={NavToRegister}
                class="
                m-2 px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 shadow-[0_4px_rgba(5,5,59,1)]
                hover:shadow-[0_4px_rgba(133,133,231,1)] active:translate-y-[4px] active:shadow-[0_0_rgb(133,133,231)] active:transition duration-100
                font-bold text-slate-200"
            >
                Sign up
            </button>
        </div>
        <span id="response">
            <span id="slime_spinner" class="flex flex-col items-center mt-3 mb-3" style="visibility: hidden;">
                <img id="slime" class="pulse" src={blob} alt="a black blob with eyes" title="Tinyblob welcomes you! " style="width: 52px; height: 45px;">
            </span>
        </span>
    </form>
    <p id="message" class="h-1 italic"></p>
    <Footer>        
    </Footer>
</Main>
