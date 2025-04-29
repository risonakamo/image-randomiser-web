<script lang="ts">
import _ from "lodash";

import {absPath} from "@/api/bridge";

/** paths of selected items */
var selecteditems:string[]=$state([]);

var dragCounter:number=$state(0);

var draggedOver:boolean=$derived(dragCounter>0);

/** dropped an item. add it to selected items after converting it into normal file path */
function onDrop(e:DragEvent):void
{
    e.preventDefault();

    if (!e.dataTransfer?.files.length)
    {
        return;
    }

    const filePaths:string[]=absPath(Array.from(e.dataTransfer.files));

    selecteditems=_.uniq(_.concat(selecteditems,filePaths));
}

/** default drag event */
function onDragIn(e:DragEvent):void{
    e.preventDefault();
    dragCounter++;
}

/** default drag event */
function onDragOut(e:DragEvent):void
{
    e.preventDefault();
    dragCounter--;
}

/** default drag event */
function onDragEnd(e:DragEvent):void
{
    e.preventDefault();
    dragCounter=0;
}

/** default drag event */
function onDragOver(e:DragEvent):void
{
    e.preventDefault();
}
</script>

<style lang="sass">
    @use "./session-create.sass"
</style>

<h1>Create Session</h1>

<div class="drop-zone" ondrop={onDrop} ondragover={onDragOver} ondragenter={onDragIn}
    ondragleave={onDragOut} ondragend={onDragEnd}
>
    drop items
</div>

<div class="selected-items">
    <p>Selected Items:</p>
    <ul>
        {#each selecteditems as item (item)}
            <li>{item}</li>
        {/each}
    </ul>
</div>

<h2>
    <a href="javascript:void(0)">Create</a>
</h2>