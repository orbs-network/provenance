<script>
  import { isEmpty } from "lodash";
  import { createEventDispatcher } from 'svelte';

  export let erc721;
  export let names;
  export let owner;
  export let tokenOwner;
  export let tokenId;

  let targetAddress;
  let targetAddressName;

  const dispatch = createEventDispatcher();

  const transferHandler = async () => {
    if (isEmpty(targetAddress)) {
        message("Could not transfer token: target address is empty");
        return;
    }

    try {
        await erc721.transferFrom(owner.address, targetAddress, tokenId);
        message(`Finished successful transfer from ${owner.address} to ${targetAddress}`);
        refresh();
    } catch (e) {
        console.log(e);
        message(`Could not transfer token: ${e}`);
    }
  }

  const findAddress = async () => {
    targetAddressName = await names.get(targetAddress);
    showTransferPromt = true;
  }

  const cancelHandler = () => {
    cancelHandler();
  }

  const message = (msg) => {
    return dispatch("message", { type: "message", message: msg });
  }

  const refresh = () => dispatch("message", { type: "tokenId", tokenId });

  const hideTransferPromt = () => showTransferPromt = false;

  const showForm = tokenOwner == owner.address;
  let showTransferPromt = false;
</script>

<style>
.form {
    padding: 0px 10px 10px 10px;
    border: 1px dotted black;
    margin-top: 10px;
    margin-bottom: 10px;
}

.serious {
    font-family: 'Monaco', 'Courier New', Courier, monospace;
    font-size: 0.9em;
    font-weight: normal;
}

input[type=text] {
    width: 300px;
}
</style>

{#if showForm}
    <div class="form">
    <h3>Rights management</h3>
    <input type="text" bind:value={targetAddress} />
    <button on:click|preventDefault={findAddress}>Find address</button>
    <br/>
    {#if showTransferPromt}
        <p><strong>Are you 100% sure</strong> that you want to transfer ownership of<br/><span class="serious">token {tokenId}</span> to<br/> 
        <span class="serious">{targetAddressName}<br/>{targetAddress}</span>?</p>
        <button on:click|preventDefault={transferHandler}>Yes, I want {targetAddressName||targetAddress} to be the new owner!</button>
        <button on:click|preventDefault={hideTransferPromt}>No</button>
    {/if}
    </div>
{/if}