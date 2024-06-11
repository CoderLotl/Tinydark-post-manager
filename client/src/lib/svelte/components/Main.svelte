<div class="flex flex-col items-center min-h-[100%] w-screen bg-black">
    <div class="flex flex-col items-center w-full lg:w-4/5 min-h-[100vh] bg-[#353535] relative overflow-auto">
        <slot>
            
        </slot>
    </div>
    <span id="server_message" class="absolute bottom-1/2 bg-[#1010102c] hidden">
        <p id="server_message_content">
            :)
        </p>
    </span>
</div>