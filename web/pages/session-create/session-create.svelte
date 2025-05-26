<script lang="ts">
import _ from "lodash";
import {onMount} from "svelte";

import {absPathDirs, getItemCount, getRememberedFolders,
    newSession} from "@/api/bridge";

/** paths of selected items */
var selecteditems:string[]=$state([]);

/** basic drag detection vars */
var dragCounter:number=$state(0);

/** value of title input text box */
var titleText:string=$state("");

// var draggedOver:boolean=$derived(dragCounter>0);

/** current items count. updated async by effect */
var itemsCount:number=$state(0);

var createDisabled:boolean=$derived(itemsCount==0);

onMount(()=>{
    (async ()=>{
        console.log("rem",await getRememberedFolders());
    })();
});

// get items count on selected items changing
$effect(()=>{
    (async ()=>{
        itemsCount=await getItemCount(
            $state.snapshot(selecteditems),
        );
    })();
});

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

/** clicked create. send request to create session. on complete, change page to session
 *  select */
async function onCreateClick():Promise<void>
{
    var title:string=titleText.trim();

    if (!title.length)
    {
        title="no title";
    }

    await newSession(
        $state.snapshot(selecteditems),
        title,
    );

    window.location.href="session-select.html";
}
</script>

<style lang="sass">
    @use "./session-create.sass"
</style>

<h1>Create Session</h1>

<p>
    title:<input type="text" bind:value={titleText}/>
</p>

<div class="drop-zone" ondrop={onDrop} ondragover={onDragOver} ondragenter={onDragIn}
    ondragleave={onDragOut} ondragend={onDragEnd}
>
    drop items
</div>

<div class="selected-items">
    <p>Selected Folders:</p>
    <ul>
        {#each selecteditems as item (item)}
            <li>
                {item}
                <a href="javascript:void(0)"onclick={onDeleteItem(item)}>delete</a>
            </li>
        {/each}
    </ul>
</div>

<div class="info">
    <p>number items: {itemsCount}</p>
</div>

<h2>
    <button onclick={onCreateClick} disabled={createDisabled}>Create</button>
</h2>

<a href="./session-select.html">Back to Session Select</a>