<script lang="ts">
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

var isWide:boolean=$state(false);
var isTall:boolean=$state(false);
var isLoading:boolean=$state(false);

var imageRef:HTMLImageElement;

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

/** on image load, detect the fit state */
function onImageLoad():void
{
    if (!imageRef)
    {
        return;
    }

    if (imageRef.naturalWidth>imageRef.naturalHeight)
    {
        isWide=true;
        isTall=false;
    }

    else
    {
        isWide=false;
        isTall=true;
    }

    isLoading=false;
}
</script>

<style lang="sass">
    @use "./image-tile.sass"
</style>

<div class="image-item" draggable={false} class:selected={selected} onclick={onTileClick}
    ondblclick={onDoubleClick}>
    <img src={img} alt="missing" draggable={true} bind:this={imageRef}
        onload={onImageLoad} class:wide-fit={isWide}
        class:tall-fit={isTall} class:loading={isLoading}/>
</div>