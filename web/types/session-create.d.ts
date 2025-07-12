// types for session create page

/** a selected item along with its count. -1 if it doesn't have
 *  a count yet */
interface ItemWithCount
{
    // a folder
    item:DirItem

    // items in the folder
    count:number

    // text to display for number of items
    countText:string
}