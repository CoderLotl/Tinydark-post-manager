<script>
    import { postAttributes } from '../js/stores/stores.js';
    import { get } from 'svelte/store';
    import { GoBack } from '../js/utilities/backbtn';
    import Home_header from './components/Home_header.svelte';

    let postAtt; $:{ postAtt = $postAttributes; }

    console.log(get(postAttributes));
</script>

<svelte:head>
    <title>Posts Manager - Edit Post</title>
</svelte:head>

<Home_header>
    <button type="button" on:click={GoBack}>
        Go Back
    </button>
</Home_header>

<div>
    
</div>