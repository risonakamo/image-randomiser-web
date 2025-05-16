<script lang="ts">
import {imageFitHook} from "@/lib/image-fit.svelte";

const {
    img,
    selected=false,
    onclick=undefined,
    ondoubleclick=undefined,
}:{
    // path to img
    img:string
    selected?:boolean

    // click event provides img path
    onclick?(img:string):void
    ondoubleclick?(img:string):void
}=$props();

var imageFit=$state(imageFitHook());

/** clicked tile */
function onTileClick():void
{
    onclick?.(img);
}

/** dbl clicked tile */
function onDoubleClick():void
{
    ondoubleclick?.(img);
}
</script>

<style lang="sass">
    @use "./image-tile.sass"
</style>

<div class="image-item" draggable={false} class:selected={selected} onclick={onTileClick}
    ondblclick={onDoubleClick}>
    <img src={img} alt="missing" draggable={true} use:imageFit.gotImageRef
        onload={imageFit.onLoad} class:wide-fit={imageFit.isWide}
        class:tall-fit={imageFit.isTall} class:loading={imageFit.isLoading}/>
</div>