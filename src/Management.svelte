<script>
  import { createEventDispatcher } from 'svelte';
  import { range, isEmpty, map, includes, random } from "lodash";
  import paintings from "./paintings.json";
  import { tellAStory } from "./story";

  export let erc721;
  export let client;
  export let owner;
  export let config;

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

  const addPainting = async (e) => {
    const names = map(tokens, "name");
    const availablePaintings = paintings.filter(p => !includes(names, p.name));
    if (!availablePaintings.length) {
      console.error("no paintings left!");
      return;
    }

    const painting = availablePaintings[random(availablePaintings.length - 1)];
    const tokenId = await tellAStory(client, owner, painting, config, message);

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
