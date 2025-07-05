<script lang="ts">
var {
    recentItemData,
    added,
    onAdd,
}:{
    recentItemData:RememberedFolder
    // visual add state
    added:boolean

    // clicked on add button for this item
    onAdd(itemData:RememberedFolder):void
}=$props();

/** clicked add button. trigger add event, unless already added, then do nothing */
function onAdd2():void
{
    if (added)
    {
        return;
    }

    onAdd(recentItemData);
}
</script>

<style lang="sass">
    @use "./recent-item-box.sass"
</style>

<div class="recent-item-box" class:added={added}>
    <div class="count">
        {recentItemData.timesUsed}
    </div>

    <div class="info">
        <div class="title">{recentItemData.title}</div>
        <div class="path">{recentItemData.path}</div>
    </div>

    <div class="button-contain">
        <div class="button" onclick={onAdd2}>
            Add
        </div>
    </div>
</div>