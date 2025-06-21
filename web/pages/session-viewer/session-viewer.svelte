<script lang="ts">
import {onMount} from "svelte";
import _ from "lodash";

import {formatTime} from "@/lib/utils";
import ImageTile from "@/components/image-tile/image-tile.svelte";
import {getPrograms, getSession, launchItem,
    openFileExplorer, updateSessionPosition} from "@/api/bridge";
import {getSessionViewerArgs} from "@/lib/url-query";
import SessionInfoBox from "@/components/session-info-box/session-info-box.svelte";
import ProgramLauncher from "@/components/program-launcher/program-launcher.svelte";

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
var initialSessionPosition:number=0;

/** name of keys held down. prevents key from activating again until released */
var heldKeys:Set<string>=new Set();

/** works as the total number of items generated */
var sessionPositionChange:number=$derived(session.position-initialSessionPosition);

onMount(async ()=>{
    const pageArgs:SessionViewerArgs=getSessionViewerArgs();

    if (!pageArgs.sessionId)
    {
        console.error("no session id");
        return;
    }

    const gotSession:RandomisationSession|undefined=await getSession(pageArgs.sessionId);

    if (!gotSession)
    {
        console.error("tried to load session, but couldn't find");
        return;
    }

    session=gotSession;
    initialSessionPosition=session.position;
    console.log(session);

    generateItems();

    programsList=await getPrograms();
});

/** key control */
function keyControl(e:KeyboardEvent):void
{
    if (heldKeys.has(e.key))
    {
        e.preventDefault();
        return;
    }

    heldKeys.add(e.key);

    // enter, space: does same thing as clicking next button
    if (e.key=="Enter" || e.key==" ")
    {
        e.preventDefault();
        onNextClick();
    }

    // number keys trigger programs
    else if (e.key=="1")
    {
        triggerProgramAtPosition(0);
    }

    else if (e.key=="2")
    {
        triggerProgramAtPosition(1);
    }

    else if (e.key=="3")
    {
        triggerProgramAtPosition(2);
    }

    else if (e.key=="4")
    {
        triggerProgramAtPosition(3);
    }

    else if (e.key=="5")
    {
        triggerProgramAtPosition(4);
    }

    // e: same as clicking open in file explorer button
    else if (e.key=="e" || e.key=="E")
    {
        onFindFileExplore();
    }

    // esc: click back to session button
    else if (e.key=="Escape")
    {
        window.location.href="./session-select.html";
    }
}

/** released a key. remove from held keys */
function keyControlRelease(e:KeyboardEvent):void
{
    heldKeys.delete(e.key);
}

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

    updateSessionPosition(session.id,session.position);

    generateAmount=_.random(generateAmountMin,generateAmountMax);
    generateItems();
}

/** trigger program at the specified position on the selected item. does nothing
 *  if there is no program at that position, or no selected item */
function triggerProgramAtPosition(programNum:number):void
{
    if (!selectedItem)
    {
        return;
    }

    if (programNum>=programsList.length)
    {
        return;
    }

    launchItem(selectedItem,programsList[programNum]);
}

/** clicked next items button. execute next items */
function onNextClick():void
{
    nextItems();
}

/** triggered open with program. open the currently selected item with the corresponding
 *  program */
function onOpenWithProgram(program:string)
{
    if (!selectedItem)
    {
        return;
    }

    launchItem(selectedItem,program);
}

/** clicked tile. set the selected item */
function onImageTileClick(img:RandomItem):void
{
    selectedItem=img.path;
}

/** double clicked image tile. open the path with the 1st program in the program list */
function onImageTileDbClick(img:RandomItem):void
{
    if (!programsList.length)
    {
        console.error("couldn't open file - no programs");
        return;
    }

    launchItem(img.path,programsList[0]);
}

/** clicked find in file explorer. trigger find in file explorer for the current item */
function onFindFileExplore():void
{
    if (!selectedItem)
    {
        return;
    }

    openFileExplorer(selectedItem);
}

/** clicked back button. go to session select */
function onBackButtonClick():void
{
    window.location.href="./session-select.html";
}
</script>

<style lang="sass">
    @use "./session-viewer.sass"
</style>

<section class="items">
    {#each currentItems as item (item.path)}
        <ImageTile img={item} selected={item.path==selectedItem}
            onclick={onImageTileClick} ondoubleclick={onImageTileDbClick}/>
    {/each}
</section>

<section class="selection-status">
    {selectedItem}
</section>

<section class="controls">
    <div class="back-button-contain" onclick={onBackButtonClick}>
        <div class="back-button">
            &lt;
        </div>
    </div>

    <ProgramLauncher programs={programsList} onClickedProgram={onOpenWithProgram}
        onClickFileExplore={onFindFileExplore}/>

    <SessionInfoBox title={session.title} generatedAmount={sessionPositionChange}
        sessionPosition={session.position} totalItems={session.items.length}/>

    <div class="next-button" onclick={onNextClick}>
        Generate
    </div>
</section>

<svelte:window onkeydown={keyControl} onkeyup={keyControlRelease}/>