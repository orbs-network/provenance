<script>
    export let message;
</script>

<style>
.message {
  padding: 10px;
  text-align: center;
  color: darkorchid;
}
</style>

{#if message}
<div class="content message">{message}</div>
{/if}