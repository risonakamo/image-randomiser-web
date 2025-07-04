<script lang="ts">
import _ from "lodash";
import {onMount} from "svelte";

import {absPathDirs, getItemCount, getRememberedFolders,
    newSession} from "@/api/bridge";
import RecentItemBox from "@/components/recent-item-box/recent-item-box.svelte";

/** paths of selected items */
var selecteditems:string[]=$state([]);

/** basic drag detection vars */
var dragCounter:number=$state(0);

/** value of title input text box */
var titleText:string=$state("");

// var draggedOver:boolean=$derived(dragCounter>0);

/** current items count. updated async by effect */
var itemsCount:ItemCounts=$state({
    individualCounts:{},
    total:0,
});

var rememberedFolders:RememberedFolder[]=$state([]);

var createDisabled:boolean=$derived(itemsCount.total==0);

/** the select items, but with count number */
var selectedItemsWithCount:ItemWithCount[]=$derived.by(()=>{
    return _.map(selecteditems,(item:string):ItemWithCount=>{
        var count:number=-1;
        var countText:string="...";

        if (item in itemsCount.individualCounts)
        {
            count=itemsCount.individualCounts[item];
            countText=count.toString();
        }

        return {
            itemName:item,
            count,
            countText,
        };
    });
});

onMount(()=>{
    (async ()=>{
        rememberedFolders=await getRememberedFolders();
    })();
});

// get items count on selected items changing
$effect(()=>{
    (async ()=>{
        console.log("getting item count",selecteditems);

        itemsCount=await getItemCount(
            $state.snapshot(selecteditems),
        );
    })();
});

/** add items to selected items. deduplicates */
function addToSelectedItems(newItems:string[]):void
{
    selecteditems=_.uniq(_.concat(selecteditems,newItems));
}

/** dropped an item. add it to selected items after converting it into normal file path */
async function onDrop(e:DragEvent):Promise<void>
{
    e.preventDefault();

    if (!e.dataTransfer?.files.length)
    {
        return;
    }

    const filePaths:string[]=await absPathDirs(Array.from(e.dataTransfer.files));

    addToSelectedItems(filePaths);
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

    await newSession(
        $state.snapshot(selecteditems),
        title,
    );

    window.location.href="session-select.html";
}

/** clicked to add a rem folder. call func to update selected items with
 *  the selected rem folder */
function onAddRemFolder(remFolderPath:string)
{
    return ()=>{
        addToSelectedItems([remFolderPath]);
    };
}
</script>

<style lang="sass">
    @use "./session-create.sass"
</style>

<section class="header-zone">
    <a href="./session-select.html">Back to Session Select</a>
</section>

<section class="title-zone">
    <input type="text" placeholder="New Session Title"/>
    <div class="create-button">
        Create Session
    </div>
</section>

<section class="items-zone">
    <div class="recent-items-contain">
        <RecentItemBox/>
    </div>

    <div class="selected-items-contain">

    </div>
</section>

<!-- <a href="./session-select.html">Back to Session Select</a>

<h1>Create Session</h1>

<p>
    title:<input type="text" bind:value={titleText}/>
</p>

<div class="remembered-items">
    <p>Recent Items</p>
    <ul>
        {#each rememberedFolders as remFolder (remFolder.path)}
            <li>
                {remFolder.title} ({remFolder.path}): {remFolder.timesUsed}
                <a href="javascript:void(0)"
                    onclick={onAddRemFolder(remFolder.path)}
                >
                    add
                </a>
            </li>
        {/each}
    </ul>
</div>

<div class="drop-zone" ondrop={onDrop} ondragover={onDragOver} ondragenter={onDragIn}
    ondragleave={onDragOut} ondragend={onDragEnd}
>
    drop items
</div>

<div class="selected-items">
    <p>Selected Folders:</p>
    <ul>
        {#each selectedItemsWithCount as item (item.itemName)}
            <li>
                {item.itemName} (number items: {item.countText})
                <a href="javascript:void(0)"
                    onclick={onDeleteItem(item.itemName)}
                >
                    delete
                </a>
            </li>
        {/each}
    </ul>
</div>

<div class="info">
    <p>number items: {itemsCount.total}</p>
</div>

<h2>
    <button onclick={onCreateClick} disabled={createDisabled}>Create</button>
</h2> -->