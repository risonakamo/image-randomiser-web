<script lang="ts">
import {onMount} from "svelte";
import _ from "lodash";

import {formatTime} from "@/lib/utils";
import ImageTile from "@/components/image-tile/image-tile.svelte";
import {getPrograms, getTestSession, launchItem} from "@/api/bridge";

const generateAmountMin:number=10;
const generateAmountMax:number=20;

var session:RandomisationSession=$state({
    id:"",
    title:"",
    position:0,
    createdDate:0,
    lastUpdateDate:0,
    originDirs:[],
    items:[],
});

/** the current items showing on the screen */
var currentItems:RandomItem[]=$state([]);

/** the next amount of items to generate */
var generateAmount:number=$state(_.random(generateAmountMin,generateAmountMax));

/** selectable program names from backend */
var programsList:string[]=$state([]);

/** path of current selected item */
var selectedItem:string|undefined=$state(undefined);

/** initial session number on first load. to track number of items advanced so far */
const initialSessionPosition:number=session.position;

/** works as the total number of items generated */
var sessionPositionChange:number=$derived(session.position-initialSessionPosition);

onMount(async ()=>{
    session=await getTestSession();
    console.log(session);

    generateItems();

    programsList=await getPrograms();
});

/** consume from the session to set the current items */
function generateItems():void
{
    if (session.position>=session.items.length)
    {
        currentItems=[];
        return;
    }

    currentItems=session.items.slice(session.position,session.position+generateAmount);
}

/** increment session position, generate new items. consumes generate amount,
 *  setting a new generate amount */
function nextItems():void
{
    if (session.position>=session.items.length)
    {
        return;
    }

    session.position+=generateAmount;
    session.position=Math.min(session.position,session.items.length);

    generateAmount=_.random(generateAmountMin,generateAmountMax);
    generateItems();
}

/** clicked next items button. execute next items */
function onNextClick():void
{
    nextItems();
}

/** clicked to launch with program */
function onTestOpenProgram(program:string)
{
    return ()=>{
        launchItem(currentItems[0].path,program);
    };
}

/** clicked tile. set the selected item */
function onImageTileClick(imgPath:string):void
{
    selectedItem=imgPath;
}
</script>

<style lang="sass">
    @use "./session-viewer.sass"
</style>

<section class="info">
    <h1>session title</h1>
    <ul>
        <li>created: {formatTime(session.createdDate)}</li>
        <li>updated: {formatTime(session.lastUpdateDate)}</li>
        <li>progress: {session.position}/{session.items.length}</li>
        <li>items generated: {sessionPositionChange}</li>
        <li>folders:
            <ul>
                {#each session.originDirs as dir (dir)}
                    <li>{dir.title} ({dir.path})</li>
                {/each}
            </ul>
        </li>
    </ul>
</section>

<section class="controls">
    <a href="javascript:void(0)" onclick={onNextClick}>Next Items</a>
</section>

<section class="items">
    {#each currentItems as item (item.path)}
        <ImageTile img={item.path} selected={item.path==selectedItem}
            onclick={onImageTileClick}/>
    {/each}
</section>

<section class="items-controls">
    {#each programsList as program}
        <p><a href="javascript:void(0)" onclick={onTestOpenProgram(program)}>
            open with: {program}
        </a></p>
    {/each}

    <p><a href="javascript:void(0)">find in file explorer</a></p>
</section>