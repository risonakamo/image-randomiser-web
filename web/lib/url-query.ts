// url query creation funcs

/** create url to go to session viewer viewing a certain session id */
export function createSessionViewerUrl(sessionId:string):string
{
    const params=new URLSearchParams({
        sessionId
    } satisfies SessionViewerArgs);

    return `./session-viewer.html?${params}`;
}

/** get session viewer args */
export function getSessionViewerArgs():SessionViewerArgs
{
    const params=new URLSearchParams(window.location.search);

    return {
        sessionId:params.get("sessionId") || undefined,
    };
}