<script lang="ts">
var {
    programs,
    onClickedProgram,
    onClickFileExplore,
}:{
    programs:string[]
    onClickedProgram(program:string):void
    onClickFileExplore():void
}=$props();

/** clicked on a program button. trigger clicked program event */
function onClickProgramButton(program:string)
{
    return ()=>{
        console.log("trigger",program);
        onClickedProgram(program);
    };
}
</script>

<style lang="sass">
    @use "./program-launcher.sass"
</style>

<div class="program-launcher">
    {#each programs as program,programI}
        <div class="program-button" onclick={onClickProgramButton(program)}>
            <div class="name">{program}</div>
            <kbd class="number">{programI+1}</kbd>
        </div>
    {/each}

    <div class="program-button" onclick={onClickFileExplore}>
        <div class="name">File Explorer</div>
        <kbd class="number">E</kbd>
    </div>
</div>