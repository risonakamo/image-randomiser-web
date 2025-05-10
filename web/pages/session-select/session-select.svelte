<script lang="ts">
import {onMount} from "svelte";

import {deleteSession, duplicateSession, getSessions} from "@/api/bridge";
import SessionBox from "@/components/session-box/session-box.svelte";

var sessions:RandomisationSession[]=$state([]);

onMount(async ()=>{
    sessions=await getSessions();
});

/** call to delete the session. update session list with result */
async function onSessionDelete(session:RandomisationSession)
{
    sessions=await deleteSession(session.id);
}

/** call backend to duplicate the session. update list with result */
async function onSessionDuplicate(session:RandomisationSession,title:string)
{
    sessions=await duplicateSession(session.id,title);
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