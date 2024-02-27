<script>
    import { afterUpdate } from 'svelte';
    import { GeneratePageButtons, GeneratePosts } from '../../js/utilities/home';
    
    function afterRender(node, callback) {
        afterUpdate(() =>
        {
            callback();
        });
    }
</script>

<div class="flex flex-col items-center w-full relative">
    <div class="bg-neutral-200 w-full h-14 py-2 flex justify-center" style="background-color: #1d1d1d;">
        <div id="page_buttons" class="flex justify-center bg-black w-full h-10 md:w-1/2 fixed" style="z-index: 999;" use:afterRender={() => { GeneratePageButtons(); }}>
        </div>
    </div>
    <div id="posts-titles-container" class="w-screen h-screen flex flex-col items-center overflow-scroll">
        <div id="posts" class="bg-black mt-16" use:afterRender={() => { GeneratePosts(); }}>
        </div>
    </div>
</div>