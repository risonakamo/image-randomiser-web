// funcs for working with session related data

import _ from "lodash";

/** return a string title for a session.
 *  todo: maybe improve this so it is more identifiable. need to test if the current
 *  strategy works or not */
export function createSessionTitle(originDirs:RandomableFolder[]):string
{
    return _.map(originDirs,(originDir:RandomableFolder):string=>{
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
// export async function duplicateSession(
//     session:RandomisationSession,
//     title:string,
// ):Promise<RandomisationSession>
// {
//     var items:RealBookmarkItem[]=await getChildItemsMultipleWithBookmarkItems(session.originDirs);
//     items=_.shuffle(items);

//     return createSession(
//         items,
//         session.originDirs,
//         title,
//     );
// }