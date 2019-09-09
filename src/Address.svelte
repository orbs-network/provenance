<script>
  export let nameRegistry;
  export let address;

  const addressToName = (addr) => {
      return nameRegistry[addr.toLowerCase()] || addr;
  }
</script>

<style>
.address {
    font-family: 'Monaco', 'Courier New', Courier, monospace;
    font-size: 0.9em;
}
</style>

<span class="address" title="{address}">{addressToName(address)}</span>