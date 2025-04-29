<script lang="ts">
import {absPath} from "@/api/bridge";

var dragCounter:number=$state(0);
var draggedOver:boolean=$derived(dragCounter>0);

function onDrop(e:DragEvent):void
{
    e.preventDefault();
    console.log("drop",e);
    console.log(absPath(e.dataTransfer!.files[0]));
}

function onDragIn(e:DragEvent):void{
    e.preventDefault();
    dragCounter++;
}

function onDragOut(e:DragEvent):void
{
    e.preventDefault();
    dragCounter--;
}

function onDragEnd(e:DragEvent):void
{
    e.preventDefault();
    dragCounter=0;
}

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
        <li>item 1</li>
        <li>item 2</li>
        <li>item 3</li>
    </ul>
</div>

<h2>
    <a href="javascript:void(0)">Create</a>
</h2>