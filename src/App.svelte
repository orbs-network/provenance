<script>
  import * as moment from "moment";

  export let erc721;
  export let provenance;
  
  export let erc721ContractLink;
  export let provenanceContractLink;

  let tokenId;
  let metadata;
  let provenanceHistory;
  let tokenOwner;

  const resetResults = () => {
    metadata = undefined;
    provenanceHistory = undefined;
    tokenOwner = undefined;
  };

  const updateResults = async () => {
    resetResults();    
    try {
      metadata = await erc721.tokenMetadata(tokenId);
      provenanceHistory = await provenance.provenance(tokenId);
      tokenOwner = await erc721.ownerOf(tokenId);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (t) => {
      return moment(t).format("YYYY/MM/DD");
  }

  tokenId = 0n;
  updateResults();
</script>

<style>
.metadata img {
    max-width: 500px;
}

.address {
    font-style: italic;
}

.tokenDetails {
    font-weight: bold;
}
</style>

<div class="content">
{#if metadata}
    <div class="metadata">
    <h1>{metadata.name}</h1>
    <img src="{metadata.image}">
    <p><span class="tokenDetails">TokenId:</span> {tokenId}</p>
    <p><span class="tokenDetails">Owner:</span> <span class="address">{tokenOwner}</span></p>
    {#if provenance && provenance[0]}
    <p><span class="tokenDetails">First owner:</span> <span class="address">{provenance[0].To}</span></p>
    {/if}

    <p><span class="tokenDetails">First owner:</span> <span class="address">{tokenOwner}</span></p>
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
