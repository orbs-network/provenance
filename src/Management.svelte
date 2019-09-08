<script>
  import { createEventDispatcher } from 'svelte';
  import { range, isEmpty, map, includes, random } from "lodash";
  import { createAccount } from "orbs-client-sdk";
  import { ERC721 } from "orbs-erc721";
  import paintings from "./paintings.json";

  export let erc721;
  export let client;

  let tokens = [];
  let showAddItem = true;

  const dispatch = createEventDispatcher();

  const getTokenList = async (num) => {
    const results = await Promise.all(range(10).map(async (id) => {
        try {
        const { name } = await erc721.tokenMetadata(id);
        return { name, id };
        } catch (e) {
        //   console.log(e)
        }
    }))

    return results.filter(t => !_.isEmpty(t));
  }

  const updateTokenList = async (num) => {
    tokens = await getTokenList(num);
    showAddItem = tokens.length < paintings.length;
  }

  async function transferOwnership(client, erc721ContractName, owner, nextOwner, tokenId) {
    const erc721 = new ERC721(client, erc721ContractName, owner.publicKey, owner.privateKey);
    await erc721.transferFrom(owner.address, nextOwner.address, tokenId);
  }

  const addPainting = async (e) => {
    const names = map(tokens, "name");
    const availablePaintings = paintings.filter(p => !includes(names, p.name));
    if (!availablePaintings.length) {
        console.error("no paintings left!");
        return;
    }

    const painting = availablePaintings[random(availablePaintings.length - 1)];

    let previousOwner = createAccount();
    const mintingERC721 = new ERC721(client, erc721.contractName, previousOwner.publicKey, previousOwner.privateKey);
    message(`Minting new token for ${painting.name}`);
    const tokenId = await mintingERC721.mint(painting);

    for (let i = 0, max = random(3, 6); i < max; i++) {
      const nextOwner = createAccount();
      message(`Transferring ownership from ${previousOwner.address} to ${nextOwner.address}`);
      await transferOwnership(client, erc721.contractName, previousOwner, nextOwner, tokenId);
      previousOwner = nextOwner;
    }

    message(`${painting.name} registered successfully`);

    updateTokenList(10);
    navigate(tokenId)();
  }

  const navigate = (tokenId) => {
    return () => {
      dispatch("message", { type: "tokenId", tokenId });
      message(null);
    }
  }

  const message = (msg) => {
    return dispatch("message", { type: "message", message: msg });
  }

  const showDot = (i) => i < tokens.length - 1 || showAddItem;

  updateTokenList(10);
</script>

<style>
nav {
    text-align: center;
}

nav .item {
    white-space: nowrap;
}

</style>

<nav>
{#each tokens as { id, name }, idx }<span class="item"><a href="#" on:click={navigate(id)}>{name}</a>{#if showDot(idx)}&MediumSpace;•{/if}</span>&MediumSpace;{/each}
{#if showAddItem}<span class="item"><a href="#" on:click={addPainting} alt="Will generate another painting">Add item</a></span>{/if}
</nav>
