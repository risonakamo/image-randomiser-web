<script lang="ts">
import _ from "lodash";
import {onMount} from "svelte";

import {absPathDirs, getItemCount, getRememberedFolders,
    newSession} from "@/api/bridge";
import AddedItemBox from "@/components/added-item-box/added-item-box.svelte";


// --- state
/** paths of selected items */
var selecteditems:DirItem[]=$state([]);

/** basic drag detection vars */
var dragCounter:number=$state(0);
var draggedOver:boolean=$derived(dragCounter>0);

/** value of title input text box */
var titleText:string=$state("");

/** current items count. updated async by effect */
var itemsCount:ItemCounts=$state({
    individualCounts:{},
    total:0,
});

var rememberedFolders:RememberedFolder[]=$state([]);

var windowDragCounter:number=$state(0);
var windowDraggedOver:boolean=$derived(windowDragCounter>0);


// --- derived
var createDisabled:boolean=$derived(itemsCount.total==0);

/** the select items, but with count number */
var selectedItemsWithCount:ItemWithCount[]=$derived.by(()=>{
    return _.map(selecteditems,(item:DirItem):ItemWithCount=>{
        var count:number=-1;
        var countText:string="...";

        if (item.path in itemsCount.individualCounts)
        {
            count=itemsCount.individualCounts[item.path];
            countText=count.toString();
        }

        return {
            item,
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
        itemsCount=await getItemCount(
            selectedItemsAsStrings(),
        );
    })();
});

/** add items to selected items. deduplicates */
function addToSelectedItems(newItems:DirItem[]):void
{
    selecteditems=_(selecteditems)
        .concat(newItems)
        .uniqBy((item:DirItem):string=>{
            return item.path;
        })
        .value();
}

/** search selected items for a path */
function selectedItemsHas(path:string):boolean
{
    return !!_.find(selecteditems,(item:DirItem):boolean=>{
        return item.path==path;
    });
}

/** convert selected items into paths array */
function selectedItemsAsStrings():string[]
{
    return _.map($state.snapshot(selecteditems),(item:DirItem):string=>{
        return item.path;
    });
}

// --- drop zone drag
/** dropped an item. add it to selected items after converting it into normal file path */
async function onDrop(e:DragEvent):Promise<void>
{
    e.preventDefault();

    if (!e.dataTransfer?.files.length)
    {
        return;
    }

    const filePaths:DirItem[]=await absPathDirs(Array.from(e.dataTransfer.files));

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
// --- end drop zone drag

/** remove item from selected items. give path of item */
function onDeleteItem(item:string)
{
    selecteditems=_.reject(selecteditems,(selectedItem2:DirItem):boolean=>{
        return item==selectedItem2.path;
    });
}

/** clicked create. send request to create session. on complete, change page to session
 *  select */
async function onCreateClick():Promise<void>
{
    var title:string=titleText.trim();

    await newSession(
        selectedItemsAsStrings(),
        title,
    );

    window.location.href="session-select.html";
}

/** clicked to add a rem folder. call func to update selected items with
 *  the selected rem folder */
function onAddRemFolder(remFolderPath:string,remFolderName:string)
{
    addToSelectedItems([{
        path:remFolderPath,
        name:remFolderName,
    }]);
}

/** clicked back button */
function onBackButton():void
{
    window.location.href="./session-select.html";
}

// --- window drag
function onWindowDragIn(e:DragEvent):void
{
    e.preventDefault();
    windowDragCounter++;
}

function onWindowDragOut(e:DragEvent):void
{
    e.preventDefault();
    windowDragCounter--;
}

function onWindowDragEnd(e:DragEvent):void
{
    e.preventDefault();
    windowDragCounter=0;
}

function onWindowDragOver(e:DragEvent):void
{
    e.preventDefault();
}

function onWindowDragDrop(e:DragEvent):void
{
    e.preventDefault();
    windowDragCounter=0;
}
// --- end window drag
</script>

<style lang="sass">
    @use "./session-create.sass"
</style>

<section class="header-zone">
    <div class="back-button-contain" onclick={onBackButton}>
        <div class="back-button">&lt;</div>
        <span>Session Select</span>
    </div>
</section>

<section class="title-zone">
    <input type="text" placeholder="New Session Title"/>
    <div class="create-button">
        Create Session
    </div>
</section>

<section class="items-zone">
    <div class="recent-items-contain">
        <h2>Recent Items</h2>
        <div class="items">
            {#each rememberedFolders as remFolder (remFolder.path)}
                <AddedItemBox
                    count={remFolder.timesUsed}
                    title={remFolder.title}
                    path={remFolder.path}
                    actionText="Add"
                    added={selectedItemsHas(remFolder.path)}
                    onAction={onAddRemFolder}
                    selectedItem={false}
                    addedText="Added"
                />
            {/each}
        </div>
    </div>

    <div class="selected-items-contain">
        <h2>Added Items</h2>
        <div class="items">
            {#each selectedItemsWithCount as item (item.item.path)}
                <AddedItemBox
                    count={item.countText}
                    title={item.item.name}
                    path={item.item.path}
                    actionText="Remove"
                    added={false}
                    onAction={onDeleteItem}
                    selectedItem={true}
                    addedText=""
                />
            {/each}
        </div>
    </div>
</section>

{#if windowDraggedOver}
    <div class="drop-zone"
        ondragenter={onDragIn} ondragleave={onDragOut}
        ondragend={onDragEnd} ondragover={onDragOver}
        ondrop={onDrop}
    ></div>
{/if}

<svelte:window
    ondragenter={onWindowDragIn} ondragleave={onWindowDragOut}
    ondragend={onWindowDragEnd} ondragover={onWindowDragOver}
    ondrop={onWindowDragDrop}/>

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