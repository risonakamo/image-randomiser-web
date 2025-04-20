<script lang="ts">
import {onMount} from "svelte";
import _ from "lodash";

import ImageTile from "@/components/image-tile/image-tile.svelte";
import {getTestSession} from "@/api/bridge";

var session:RandomisationSession=$state({
    id:"",
    title:"",
    position:0,
    createdDate:0,
    lastUpdateDate:0,
    originDirs:[],
    items:[],
});
var currentItems:RandomItem[]=$state([]);
var generateAmount:number=$state(10);

onMount(async ()=>{
    session=await getTestSession();
    console.log(session);

    generateItems();
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
    session.position+=generateAmount;
    generateAmount=_.random(8,15);
    generateItems();
}

/** clicked next items button. execute next items */
function onNextClick():void
{
    nextItems();
}
</script>

<style lang="sass">
    @use "./session-viewer.sass"
</style>

<section class="info">
    <h1>session title</h1>
    <ul>
        <li>created: 2025-02-28 13:40:34</li>
        <li>updated: 2025-02-28 13:40:34</li>
        <li>progress: 20/100</li>
        <li>items generated: 20</li>
        <li>folders:
            <ul>
                <li>folder 1</li>
                <li>folder 2</li>
                <li>folder 3</li>
            </ul>
        </li>
    </ul>
</section>

<section class="controls">
    <a href="javascript:void(0)" onclick={onNextClick}>Next Items</a>
</section>

<section class="items">
    {#each currentItems as item (item.path)}
        <ImageTile img={item.path}/>
    {/each}
</section>

<section class="items-controls">
    <p><a href="javascript:void(0)">open with program 1</a></p>
    <p><a href="javascript:void(0)">find in file explorer</a></p>
</section>