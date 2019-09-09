<script>
  export let nameRegistry;
  export let address;
  let copy = false;

  let addressLowercase = address.toLowerCase();

  const addressToName = () => {
    return nameRegistry[addressLowercase] || addressLowercase;
  }

  const copyAddress = async () => {
    console.log(`Copied to clipboard: ${addressLowercase}`);
  }
</script>

<style>
.address {
    text-decoration: underline dotted;
}
</style>

<span class="address" title="{address}" on:click={copyAddress}>{addressToName()}</span>