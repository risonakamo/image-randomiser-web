<script lang="ts">
const {
    img,
    selected=false,
    onclick=undefined,
}:{
    // path to img
    img:string
    selected?:boolean

    // click event provides img path
    onclick?(img:string):void
}=$props();

/** clicked tile */
function onTileClick():void
{
    onclick?.(img);
}
</script>

<style lang="sass">
    @use "./image-tile.sass"
</style>

<div class="image-item" draggable={false} class:selected={selected} onclick={onTileClick}>
    <img src={img} alt="missing" draggable={true}/>
</div>