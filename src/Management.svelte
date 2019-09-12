<script>
  import Metadata from "./Metadata.svelte";
  import { createEventDispatcher } from 'svelte';
  import { range, isEmpty, map, includes, random, intersectionBy, isEqual } from "lodash";
  import paintings from "./paintings.json";
  import { tellAStory } from "./story";

  export let erc721;
  export let client;
  export let owner;
  export let config;

  let tokens = [];
  let showAddItem = true;
  let showMetadata = {show: false};

  const MAX_NAVIGATION_ITEMS = 50;

  const dispatch = createEventDispatcher();

  const getTokenList = async (num) => {
    const results = await Promise.all(range(num).map(async (id) => {
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
    
    // check if all the paintings are already included in the list of tokens
    showAddItem = !isEqual(
      map(intersectionBy(tokens, paintings, "name"), "name").sort(),
      map(paintings, "name").sort());
  }

  const addPainting = async (e) => {
    const names = map(tokens, "name");
    const availablePaintings = paintings.filter(p => !includes(names, p.name));
    if (!availablePaintings.length) {
      console.error("no paintings left!");
      return;
    }

    const painting = availablePaintings[random(availablePaintings.length - 1)];
    const tokenId = await tellAStory(client, owner, painting, config, message);

    updateTokenList(MAX_NAVIGATION_ITEMS);
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

  const forwardMessage = (msg) => {
    updateTokenList(MAX_NAVIGATION_ITEMS);
    dispatch("message", msg.detail);
  }

  updateTokenList(MAX_NAVIGATION_ITEMS);
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
{#each tokens as { id, name }, idx }<span class="item"><a href="#" on:click={navigate(id)}>{name}</a>&MediumSpace;•</span>&MediumSpace;{/each}
{#if showAddItem}<span class="item"><a href="#" on:click={addPainting} alt="Will generate another painting">Add item</a>&MediumSpace;•</span>{/if}&MediumSpace;
<span class="item"><a href="#" on:click={() => showMetadata = {show: true}} >Mint token</a></span>
</nav>

<Metadata showContainer={showMetadata} erc721={erc721} owner={owner} on:message={forwardMessage}/>