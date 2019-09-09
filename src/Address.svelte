<script>
  export let nameRegistry;
  export let address;

  const addressToName = (addr) => {
      return nameRegistry[addr.toLowerCase()] || addr;
  }
</script>

<style>
.address {
    text-decoration: underline dotted;
}
</style>

<span class="address" title="{address}">{addressToName(address)}</span>