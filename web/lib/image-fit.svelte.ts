/** returns some bool states on if the image should be wide or tall.
 *  give it ref of the img element to handle. attach the returned onload
 *  function to the image. */
export function imageFitHook()
{
    var imageRef:HTMLImageElement|undefined=undefined;

    var isWide:boolean=$state(false);
    var isTall:boolean=$state(false);
    var isLoading:boolean=$state(true);

    /** action triggered giving the ref */
    function gotImageRef(ref:HTMLImageElement):void
    {
        imageRef=ref;
    }

    /** on image element load, detect the ratio */
    function onLoad():void
    {
        console.log("on load");

        if (!imageRef)
        {
            console.log("no ref");
            return;
        }

        if (imageRef.naturalWidth>imageRef.naturalHeight)
        {
            isWide=true;
            isTall=false;
        }

        else
        {
            isWide=false;
            isTall=true;
        }

        console.log("done");
        isLoading=false;
    }

    return {
        onLoad,
        gotImageRef,

        isWide,
        isTall,
        isLoading,
    } as const;
}