<script lang="ts">
import {onMount} from "svelte";

import {getSessions} from "@/api/bridge";
import SessionBox from "@/components/session-box/session-box.svelte";

var sessions:RandomisationSession[]=$state([]);

onMount(async ()=>{
    sessions=await getSessions();
});

function onSessionDelete(session:RandomisationSession)
{

}

function onSessionDuplicate(session:RandomisationSession,title:string)
{

}
</script>

<div class="controls">
    <h2><a href="./session-create.html">create session</a></h2>
    <h2><a href="javascript:void(0)">reset storage</a></h2>
</div>

<div class="sessions">
    {#each sessions as session (session.id)}
        <SessionBox session={session} ondelete={onSessionDelete}
            onduplicate={onSessionDuplicate}/>
    {/each}
</div>