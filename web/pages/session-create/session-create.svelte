<script lang="ts">
import _ from "lodash";

import {absPathDirs} from "@/api/bridge";

/** paths of selected items */
var selecteditems:string[]=$state([]);

var dragCounter:number=$state(0);

var draggedOver:boolean=$derived(dragCounter>0);

/** dropped an item. add it to selected items after converting it into normal file path */
async function onDrop(e:DragEvent):Promise<void>
{
    e.preventDefault();

    if (!e.dataTransfer?.files.length)
    {
        return;
    }

    const filePaths:string[]=await absPathDirs(Array.from(e.dataTransfer.files));

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

/** remove item from selected items */
function onDeleteItem(item:string)
{
    return ()=>{
        _.remove(selecteditems,(selectedItem:string):boolean=>{
            return item==selectedItem;
        });
    };
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
            <li>
                {item}
                <a href="javascript:void(0)"onclick={onDeleteItem(item)}>delete</a>
            </li>
        {/each}
    </ul>
</div>

<h2>
    <a href="javascript:void(0)">Create</a>
</h2>