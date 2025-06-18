<script lang="ts">
var {
    title,
    generatedAmount,
    sessionPosition,
    totalItems,
}:{
    title:string
    generatedAmount:number

    sessionPosition:number
    totalItems:number
}=$props();
</script>

<style lang="sass">
    @use "./session-info-box.sass"
</style>

<div class="session-info-box">
    <div class="top">
        <h2>{title}</h2>
        <h3>{generatedAmount} Generated</h3>
    </div>
    <div class="bottom">
        <span class="progress-text">{sessionPosition}/{totalItems}</span>
        <span class="progress-bar"></span>
    </div>
</div>