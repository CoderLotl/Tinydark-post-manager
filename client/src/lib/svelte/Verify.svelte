<script>
    import { onMount } from 'svelte';
    import { Verify } from '../js/utilities/verify';
    import { GoBack } from '../js/utilities/utilities.js';
    import '../js/utilities/verify.js';

    onMount(() => {
        Verify();
    });
</script>

<div id="verify-content">
    
</div>
<button on:click={GoBack}>Go Back</button>
