

<script lang="ts">
    import { base } from "$app/paths";
</script>


<slot />

<footer class="backlink">
    <a href={`${base}/`}>Back to root</a>
</footer>


<style>
    .backlink {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 1rem 1rem;
        display: flex;
        justify-content: center;
        z-index: 2;
    }

    .backlink :where(a) {
        color: #fff !important;
    }
</style>