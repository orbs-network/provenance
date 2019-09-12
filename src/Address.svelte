<script>
  import copy from "clipboard-copy";
  export let nameRegistry;
  export let address;

  let addressLowercase = address.toLowerCase();

  const addressToName = () => {
    return nameRegistry[addressLowercase] || addressLowercase;
  }

  const copyAddress = async () => {
    copy(addressLowercase);
    console.log(`Copied to clipboard: ${addressLowercase}`);
  }
</script>

<style>
.address {
    text-decoration: underline dotted;
}
</style>

<span class="address" title="Click to copy {address}" on:click={copyAddress}>{addressToName()}</span>