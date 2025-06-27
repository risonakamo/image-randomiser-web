// types copied from backend

/** individual counts of folders in item counts result
 *  key: path of folder
 *  val: items in that folder */
type ItemCountsDict=Record<string,number>

/** api available to frontend */
interface Bridge
{
    getTestSession():Promise<RandomisationSession>
    launchItem(item:string,program:string):Promise<void>
    getPrograms():Promise<string[]>
    absPathDirs(files:File[]):Promise<string[]>
    newSession(folders:string[],title:string):Promise<void>
    getSessions():Promise<RandomisationSession[]>
    deleteSession(deleteId:string):Promise<RandomisationSession[]>
    duplicateSession(duplicateId:string,title:string):Promise<RandomisationSession[]>
    getItemCount(folders:string[]):Promise<ItemCounts>
    getSession(sessionId:string):Promise<RandomisationSession|undefined>
    openFileExplorer(item:string):Promise<void>
    updateSessionPosition(sessionId:string,newPosition:number):Promise<void>
    getRememberedFolders():Promise<RememberedFolder[]>
    resetStore():Promise<void>
}

/** random session */
interface RandomisationSession
{
    id:string
    title:string

    // all items before this are consumed, on and
    // after are NOT consumed
    position:number

    // unix milleseconds
    createdDate:number
    lastUpdateDate:number

    originDirs:RandomableFolder[]
    items:RandomItem[]
}

/** a target folder that contains randomable items */
interface RandomableFolder
{
    // name of the folder
    title:string

    // filepath of the folder. also works as unique id
    path:string
}

/** a randomable item */
interface RandomItem
{
    // filepath to the item. also a unique id
    path:string
}

/** a folder once used in randomisation. adds additional tracking info fields */
interface RememberedFolder extends RandomableFolder
{
    timesUsed:number
    lastUseDate:number
}

/** result of items count */
interface ItemCounts
{
    individualCounts:ItemCountsDict
    total:number
}