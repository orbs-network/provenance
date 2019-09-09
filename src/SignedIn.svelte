<script>
   import Address from "./Address.svelte";
   import { isEmpty } from "lodash";

   export let names;
   export let owner;

  const getRegistry = async () => {
    let registry = await names.getAll([owner.address]);
    if (isEmpty(registry)) {
        await names.set(Chance().name({ nationality: "en" }));
        registry = await names.getAll([owner.address]);
    }

    return registry;
  }
</script>

<style>
.login {
    z-index: 10;
    float: right;
    padding: 30px;
}
</style>

{#await getRegistry()}
<!-- -->
{:then nameRegistry}
<div class="login">
Signed in as<br/><Address address={owner.address} nameRegistry={nameRegistry} />
</div>
{/await}