<script>
  import { first, last } from "lodash";
  import Management from "./Management.svelte";
  import Message from "./Message.svelte";
  import * as moment from "moment";

  export let client;
  export let erc721;
  export let provenance;
  
  export let erc721ContractLink;
  export let provenanceContractLink;

  let tokenId;
  let metadata;
  let provenanceHistory;
  let tokenOwner;

  let message;

  const resetResults = () => {
    metadata = undefined;
    provenanceHistory = undefined;
    tokenOwner = undefined;
  };

  const updateResults = async (id) => {
    resetResults();
    try {
        tokenId = id;
        metadata = await erc721.tokenMetadata(tokenId);
        provenanceHistory = await provenance.provenance(tokenId);
        tokenOwner = await erc721.ownerOf(tokenId);
    } catch (err) {
        resetResults();
        console.error(err);
    }
  };

  const formatTime = (t) => {
    return moment(t).format("YYYY/MM/DD");
  }

  const handleMessage = (event) => {
    const { type, tokenId, message: msg } = event.detail;

    if (type === "tokenId") {
        updateResults(tokenId);
    }

    if (type === "message") {
        message = msg;
    }
  }

  updateResults(0);  
</script>

<style>
.metadata img {
    max-width: 500px;
}

.address {
    font-family: 'Monaco', 'Courier New', Courier, monospace;
    font-size: 0.9em;
}

.tokenDetails {
    font-weight: bold;
}
</style>

<Management client={client} erc721={erc721} on:message={handleMessage} />
<Message message={message} />

<div class="content">
{#if metadata }
    <div class="metadata">
    <h1>{metadata.name}</h1>
    <img src="{metadata.image}" alt="{metadata.name}">
    <p><span class="tokenDetails">TokenId:</span> {tokenId}</p>

    {#if provenanceHistory}
    <p><span class="tokenDetails">Owner:</span> <span class="address">{last(provenanceHistory).To}</span></p>    
    <p><span class="tokenDetails">First owner:</span> <span class="address">{first(provenanceHistory).To}</span></p>
    {/if}

    <p>{metadata.description}</p>
</div>
{/if}

{#if provenanceHistory}
    <div class="provenance">
    <h2>Provenance</h2>
    {#each provenanceHistory as {From, To, Timestamp}}
        {#if From == "0x"}
        <p>On {formatTime(Timestamp)} item created by <span class="address">{To}</span></p>
        {:else}
        <p>On {formatTime(Timestamp)} ownership transferred from <span class="address">{From}</span> to <span class="address">{To}</span></p>
    {/if}
    {/each}
</div>
{/if}

<p><a href="{erc721ContractLink}" target=_blank>ERC721 contract on Prism</a></p>
<p><a href="{provenanceContractLink}" target=_blank>Provenance contract on Prism</a></p>
<p><a href="https://github.com/orbs-network/provenance" target=_blank>Orbs Github</a></p>
</div>
