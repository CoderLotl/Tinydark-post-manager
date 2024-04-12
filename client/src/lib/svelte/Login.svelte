<script>    
    import { navigate } from 'svelte-routing';
    import { BASE_PATH } from "../js/stores/stores.js";
    import { get } from 'svelte/store';
    import { Login } from '../js/utilities/home.js';

    import blob from '../../assets/2022_sm_002.png';

    let loggedIn = false;

    function NavToRegister(event)
    {
        let BASE_PATH_ = get(BASE_PATH);
        event.preventDefault();
        navigate(`${BASE_PATH_}` + '/register');
    }    
</script>

<svelte:head>
    <title>Posts Manager - Login</title>
</svelte:head>

<div id="form-login-container" class="flex flex-col justify-center items-center h-screen w-screen">
    <form id="form-login" class="flex flex-col justify-center items-center border-solid rounded-lg border border-black md:w-1/4 md:h-1/2 min-h-min overflow-auto p-4">
        <div class="flex flex-col">
            <label for="user">
                Login Name:
            </label>
            <input id="user" type="text" placeholder="Username" autocomplete="off" class="bg-gray-900 rounded-lg text-gray-200 mt-1 mb-2 pl-3">
            <label for="password">
                Password:
            </label>
            <input id="password" type="password" placeholder="Password" autocomplete="off" class="bg-gray-900 rounded-lg text-gray-200 mt-1 mb-2 pl-3">
        </div>
        <button on:click={NavToRegister}>
            Register an account
        </button>
        <button id="login-btn" on:click={Login} class="m-2">
            Login
        </button>
        <span id="response">
            <span id="slime_spinner" class="flex flex-col items-center mt-3 mb-3" style="visibility: hidden;">
                <img id="slime" class="pulse" src={blob} alt="a black blob with eyes" title="Tinyblob welcomes you! " style="width: 52px; height: 45px;">
            </span>
        </span>
    </form>
    <p id="message" class="h-1 italic"></p>
</div>