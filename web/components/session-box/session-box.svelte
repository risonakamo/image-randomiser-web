<script lang="ts">
// session info box appearing on session select page

import {createSessionTitle} from "@/lib/session";
import {createSessionViewerUrl} from "@/lib/url-query";
import {formatTime} from "@/lib/utils";
import humanize from "humanize-duration";

var {
    session,

    ondelete,
    onduplicate,
}:{
    session:RandomisationSession,

    ondelete(session:RandomisationSession):void,
    onduplicate(session:RandomisationSession,title:string):void,
}=$props();

/** if the duplicate menu is showing */
var duplicateMenuShowing:boolean=$state(false);

/** contents of the duplicate menu title textbox */
var duplicateTitle:string=$state("");

/** url to go to randomiser page targetting this session */
// var randomiserUrl:string=$derived(createRandomiserUrl(session.id));
/** if this session is marked as complete */
var sessionComplete:boolean=$derived(session.position>=session.items.length);

/** text of the duplicate button */
var duplicateButtonText:string=$derived.by(()=>{
    if (duplicateMenuShowing)
    {
        return "do duplicate";
    }

    return "duplicate";
});

var viewerUrl:string=$derived(createSessionViewerUrl(session.id));

var sessionPercent:number=$derived(Math.round((session.position/session.items.length)*100));

var createTimeRelative:string=$derived(humanize(
    new Date().getTime()-session.createdDate,
    {
        largest:1,
        round:true,
    }
));

var updateTimeRelative:string=$derived(humanize(
    new Date().getTime()-session.lastUpdateDate,
    {
        largest:1,
        round:true,
    }
));

/** clicked delete button. call delete event with the session */
function onDelete(e:MouseEvent):void
{
    e.preventDefault();
    e.stopPropagation();
    ondelete(session);
}

/** clicked duplicate button. do action based on if duplicate menu is showing */
function onDuplicate(e:MouseEvent):void
{
    e.preventDefault();
    e.stopPropagation();

    // if menu not showing, show the menu, and set the title select box contents
    // to the current session's title.
    if (!duplicateMenuShowing)
    {
        duplicateTitle=session.title;
        duplicateMenuShowing=true;
    }

    // otherwise, the duplicate menu was already showing. perform the duplication using
    // the duplicate menu textbox contents as the title. if the textbox was empty,
    // generate a title.
    // then, hide the duplicate menu.
    else
    {
        var newTitle:string=duplicateTitle.trim();

        if (newTitle.length==0)
        {
            newTitle=createSessionTitle(session.originDirs);
        }

        onduplicate(
            $state.snapshot(session),
            newTitle,
        );

        duplicateMenuShowing=false;
    }
}

/** clicked on the box. navigate page to viewer url */
function onClick():void
{
    if (sessionComplete)
    {
        return;
    }

    window.location.href=viewerUrl;
}

/** cancel click propagation inside dupe menu */
function onDupeMenuClick(e:MouseEvent):void
{
    e.stopPropagation();
}
</script>

<style lang="sass">
    @use "./session-box.sass"
</style>

<div class="session-box" class:complete={sessionComplete} onclick={onClick}>
    <div class="top">
        <div class="left">
            <h2>{session.title}</h2>
            <div class="progress-bar">
                <div class="inner" style:width={`${sessionPercent}%`}></div>
            </div>
        </div>

        <div class="right">
            <div class="box-button" onclick={onDelete}>
                🗑
            </div>
            <div class="box-button" onclick={onDuplicate}>
                ⎘
            </div>
        </div>
    </div>

    <div class="bottom">
        <span class="progress">{session.position}/{session.items.length}</span>
        <span class="percent">{sessionPercent}%</span>
        <span class="faded created" title={formatTime(session.lastUpdateDate)}>
            Updated {updateTimeRelative} ago
        </span>
        <span class="faded">•</span>
        <span class="faded" title={formatTime(session.createdDate)}>
            Created {createTimeRelative} ago
        </span>
        <span class="faded">•</span>
        <span class="faded">Items List</span>
    </div>

    <div class="dupe-menu" onclick={onDupeMenuClick}>
        <label>New Title:</label>
        <input type="text" class="dupe-input"/>
        <div class="box-button">✓</div>
    </div>
</div>

<!-- <div class="session-box">
    <h2>
        {#if !sessionComplete}
            <a href={viewerUrl}>{session.title}</a>
        {:else}
            <s>{session.title}</s>
        {/if}
    </h2>
    <h3>{session.id}</h3>
    <p>created: {formatTime(session.createdDate)}</p>
    <p>updated: {formatTime(session.lastUpdateDate)}</p>
    <p>progress: {session.position}/{session.items.length}</p>
    <p>items:</p>
    <ul>
        {#each session.originDirs as originDir (session.id+originDir.path)}
            <li>{originDir.title}</li>
        {/each}
    </ul>
    <div class="controls">
        <a href="javascript:void(0)" onclick={h_delete}>delete</a>
        <a href="javascript:void(0)" onclick={h_duplicate}>{duplicateButtonText}</a>
        <div class="duplicate-menu" class:hidden={!duplicateMenuShowing}>
            <label>New Title:</label>
            <input type="text" bind:value={duplicateTitle}/>
        </div>
    </div>
</div> -->