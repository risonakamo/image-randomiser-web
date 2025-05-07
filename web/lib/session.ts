// funcs for working with session related data

import _ from "lodash";
import {getTimestamp} from "@/lib/util";
import {getChildItemsMultipleWithBookmarkItems} from "@/lib/bookmark";

/** create a session. items is the actual bookmark items of the session, dirs is the
 *  bookmark folders used to choose the items */
export function createSession(
    items:RealBookmarkItem[],
    dirs:BookmarkItem[],
    title:string,
):RandomisationSession
{
    return {
        id:window.crypto.randomUUID().slice(0,15),
        title,

        items,

        position:0,

        createdDate:getTimestamp(),
        lastUpdateDate:getTimestamp(),

        originDirs:dirs,
    };
}

/** return a string title for a session.
 *  todo: maybe improve this so it is more identifiable. need to test if the current
 *  strategy works or not */
export function createSessionTitle(originDirs:BookmarkItem[]):string
{
    return _.map(originDirs,(originDir:BookmarkItem):string=>{
        return originDir.title;
    }).join(", ");
}

/** sort sessions by last updated time, newest first */
export function sortSessions(sessions:RandomisationSession[]):RandomisationSession[]
{
    return _.reverse(_.sortBy(sessions,(session:RandomisationSession):Date=>{
        return new Date(session.lastUpdateDate);
    }));
}

/** create a new session using a session as base. regenerates all items from the origin dirs of the
 *  session (so the number of items in the session might not be the same) */
export async function duplicateSession(
    session:RandomisationSession,
    title:string,
):Promise<RandomisationSession>
{
    var items:RealBookmarkItem[]=await getChildItemsMultipleWithBookmarkItems(session.originDirs);
    items=_.shuffle(items);

    return createSession(
        items,
        session.originDirs,
        title,
    );
}