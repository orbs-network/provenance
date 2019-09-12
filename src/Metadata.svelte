<script>
  import { createEventDispatcher } from 'svelte';
  import { isEmpty } from "lodash";

  let name;
  let description;
  let image;

  export let erc721;
  export let owner;
  
  export let showContainer = {show: false};

  const dispatch = createEventDispatcher();

  const clearForm = () => {
      name = undefined;
      description = undefined;
      image = undefined;
  }

  const mint = async () => {
    if (isEmpty(name) || isEmpty(description) || isEmpty(image)) {
        return;
    }
    
    const tokenId = await erc721.mint({name, description, image});
    clearForm();
    showContainer = {show: false};
    dispatch("message", { type: "tokenId", tokenId });
    dispatch("message", { type: "message", message: null })
  }

  const hide = () => showContainer.show = false;


</script>

<style>

.form {
    padding: 0px 10px 10px 10px;
    border: 1px dotted black;
    margin-top: 10px;
    margin-bottom: 10px;
}

fieldset {
    border: none;
    padding-left: 0;
}

input[type=text] {
    width: 100%;
}

textarea {
    width: 100%;
    height: 300px;
}

</style>

{#if showContainer.show}
<div class="content form forward">
    <h3>Add item</h3>
    <fieldset>
        <label>Name</label><br/>
        <input bind:value={name} type="text" placeholder=""><br/>
    </fieldset>
    
    <fieldset>
        <label>Image link</label><br/>
        <input bind:value={image} type="text" placeholder="">
    </fieldset>
    <fieldset>
        <label>Description</label><br/>
        <textarea bind:value={description} placeholder=""></textarea>
    </fieldset>
    
    <button on:click={mint}>Mint token</button><button on:click={hide}>Cancel</button>
</div>
{/if}