<script lang="ts">
    const {
        img,
    }:{
        img:string
    }=$props();
</script>

<style lang="sass">
    @use "./image-tile.sass"
</style>

<div class="image-item" draggable={false}>
    <img src={img} alt="missing" draggable={true}/>
</div>