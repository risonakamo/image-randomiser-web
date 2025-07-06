<script lang="ts">
var {
    count,
    title,
    path,

    actionText,

    added,
    onAction,
}:{
    count:number|string
    title:string
    path:string

    actionText:string

    // visual add state
    added:boolean

    // clicked on button for this item
    onAction(path:string):void
}=$props();

/** clicked add button. trigger add event, unless already added, then do nothing */
function onAction2():void
{
    if (added)
    {
        return;
    }

    onAction(path);
}
</script>

<style lang="sass">
    @use "./added-item-box.sass"
</style>

<div class="added-item-box" class:added={added}>
    <div class="count">
        {count}
    </div>

    <div class="info">
        <div class="title">{title}</div>
        <div class="path">{path}</div>
    </div>

    <div class="button-contain">
        <div class="button" onclick={onAction2}>
            {actionText}
        </div>
    </div>
</div>