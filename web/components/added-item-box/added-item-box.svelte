<script lang="ts">
var {
    count,
    title,
    path,

    actionText,
    addedText,
    countHoverText,

    added,
    selectedItem,

    onAction,
}:{
    count:number|string
    title:string
    path:string

    actionText:string
    addedText:string
    countHoverText:string

    // visual add state
    added:boolean
    selectedItem:boolean

    // clicked on button for this item
    onAction(path:string,title:string):void
}=$props();

/** clicked add button. trigger add event, unless already added, then do nothing */
function onAction2():void
{
    if (added)
    {
        return;
    }

    onAction(path,title);
}
</script>

<style lang="sass">
    @use "./added-item-box.sass"
</style>

<div class="added-item-box" class:added={added} class:selected-item={selectedItem}>
    <div class="count" title={countHoverText}>
        {count}
    </div>

    <div class="info">
        <div class="title">{title}</div>
        <div class="path">{path}</div>
    </div>

    <div class="button-contain">
        {#if !added}
            <div class="button" onclick={onAction2}>
                {actionText}
            </div>
        {:else}
            {addedText}
        {/if}
    </div>
</div>