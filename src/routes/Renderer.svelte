<script lang="ts">
    import { app, initialize} from "$lib/core/index.ts";
    import { onMount } from "svelte";

    onMount(() => {
        console.log(app);
        initialize(document.body);
    })
</script>


<style>
    :global(body) {
        margin: 0;
        padding: 0;
        scroll-snap-type: none;
    }
</style>