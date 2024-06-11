<script>
    import { Logout } from '../../js/utilities/home';    
    import { StorageManager } from '../../js/services/StorageManager';
    import blob from '../../../assets/2022_sm_002.png';
    import logo_light from '../../../assets/logo_light.svg';
    
    let sm = new StorageManager();
    let name = sm.ReadLS('user');
</script>

<header class="px-2 md:px-0 fixed w-screen" style="z-index: 777;">
    <div class="container mx-auto py-2 flex justify-between items-center">
        <a class="logo_holder" href="https://tinydark.com/">
            <span id="slimeholder" class="bouncy">
                <img id="slime" src={blob} alt="a black blob with eyes" title="Tinyblob welcomes you! " style="width: 52px; height: 45px;">
            </span>
            <img class="ml-2" src={logo_light} id="logo" alt="">
        </a>
        <nav class="flex items-center">
            <p class="m-0">Welcome {name}.</p>
            <button style="margin-left: 20px;" on:click={Logout}>
                Log out
            </button>
        </nav>
    </div>
    <slot>
        
    </slot>
</header>