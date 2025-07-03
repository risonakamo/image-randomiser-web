<script lang="ts">
import {onMount} from "svelte";

import {deleteSession, duplicateSession, getSessions, resetStore} from "@/api/bridge";
import SessionBox from "@/components/session-box/session-box.svelte";
import _ from "lodash";

var sessions:RandomisationSession[]=$state([]);

var sortedSessions:RandomisationSession[]=$derived.by(()=>{
    return _.sortBy(sessions,(session:RandomisationSession):number=>{
        return session.lastUpdateDate;
    }).toReversed();
});

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

/** clicked reset store. call to reset, then get new session list */
async function onResetStore():Promise<void>
{
    await resetStore();
    sessions=await getSessions();
}

/** clicked create button. go to create page */
function onCreateClick():void
{
    window.location.href="./session-create.html";
}
</script>

<style lang="sass">
    @use "./session-select.sass"
</style>

<!-- <div class="controls">
    <h2><a href="./session-create.html">create session</a></h2>
    <h2><a href="javascript:void(0)" onclick={onResetStore}>reset storage</a></h2>
</div>

<div class="sessions">
    {#each sortedSessions as session (session.id)}
        <SessionBox session={session} ondelete={onSessionDelete}
            onduplicate={onSessionDuplicate}/>
    {/each}
</div> -->

<div class="contain">
    <div class="controls">
        <div class="create-button" onclick={onCreateClick}>
            + Create
        </div>
    </div>

    <div class="session-list">
        {#each sortedSessions as session (session.id)}
            <SessionBox session={session} ondelete={onSessionDelete}
                onduplicate={onSessionDuplicate}/>
        {/each}
    </div>
</div>