<script lang="ts">
import {onMount} from "svelte";

import ImageTile from "@/components/image-tile/image-tile.svelte";
import {getTestSession} from "@/api/bridge";

onMount(async ()=>{
    console.log(await getTestSession());
});
</script>

<style lang="sass">
    @use "./session-viewer.sass"
</style>

<section class="controls">
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

<section class="items">
    <ImageTile img="C:/Users/ktkm/Pictures/Screenshots/Annotation 2023-02-06 201313.png"/>
    <ImageTile img="C:/Users/ktkm/Pictures/Screenshots/giant.jpg"/>
    <ImageTile img="C:/Users/ktkm/Pictures/Screenshots/Annotation 2023-02-07 200050.png"/>
</section>

<section class="items-controls">
    <p><a href="javascript:void(0)">open with program 1</a></p>
    <p><a href="javascript:void(0)">find in file explorer</a></p>
</section>