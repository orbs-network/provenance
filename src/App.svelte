<script>
  import { first, map, union } from "lodash";
  import Management from "./Management.svelte";
  import Message from "./Message.svelte";
  import Address from "./Address.svelte";
  import SignedIn from "./SignedIn.svelte";
  import Transfer from "./Transfer.svelte";
  import * as moment from "moment";

  export let client;
  export let erc721;
  export let provenance;
  export let names;
  
  export let owner;
  export let config;

  let tokenId;
  let metadata;
  let provenanceHistory;
  let nameRegistry;
  let tokenOwner;

  let message;

  const resetResults = () => {
    metadata = undefined;
    provenanceHistory = undefined;
    tokenOwner = undefined;
    nameRegistry = undefined;
  };

  const updateResults = async (id) => {
    resetResults();
    try {
        tokenId = id;
        metadata = await erc721.tokenMetadata(tokenId);
        provenanceHistory = await provenance.provenance(tokenId);
        nameRegistry = await names.getAll(union(map(provenanceHistory, "From"), map(provenanceHistory, "To")));
        tokenOwner = await erc721.ownerOf(tokenId);
    } catch (err) {
        resetResults();
        console.error(err);
    }
  };

  const formatTime = (t) => {
    return moment(t).format("YYYY/MM/DD");
  }

  const contractLink = (contractName) => `${config.prismURL}/vchains/${config.vchain}/contract/${contractName}`;

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

.tokenDetails {
    font-weight: bold;
}
</style>

<Management
    client={client}
    erc721={erc721}
    owner={owner}
    config={config}
    on:message={handleMessage} />
<Message message={message} />

<SignedIn names={names} owner={owner} />

<div class="content">
{#if metadata }
    <div class="metadata">
    <h1>{metadata.name}</h1>
    <img src="{metadata.image}" alt="{metadata.name}">
    <p><span class="tokenDetails">TokenId:</span> {tokenId}</p>

    {#if provenanceHistory && nameRegistry && tokenOwner }
    <p>
        <span class="tokenDetails">Owner:</span> <Address address={tokenOwner} nameRegistry={nameRegistry} />
        <Transfer tokenOwner={tokenOwner} owner={owner} erc721={erc721} names={names} tokenId={tokenId} on:message={handleMessage} />
    </p>
    <p><span class="tokenDetails">First owner:</span> <Address address={first(provenanceHistory).To} nameRegistry={nameRegistry} /></p>
    {/if}

    <p>{metadata.description}</p>
</div>
{/if}

{#if provenanceHistory && nameRegistry}
    <div class="provenance">
    <h2>Provenance</h2>
    {#each provenanceHistory as {From, To, Timestamp}}
        {#if From == "0x"}
        <p>On {formatTime(Timestamp)} item created by <Address address={To} nameRegistry={nameRegistry} /></p>
        {:else}
        <p>On {formatTime(Timestamp)} ownership transferred from <Address address={From} nameRegistry={nameRegistry} /> to <Address address={To} nameRegistry={nameRegistry} /></p>
    {/if}
    {/each}
</div>
{/if}

<hr>
<p><a href="{contractLink(config.erc721ContractName)}" target=_blank>ERC721 contract on Prism</a></p>
<p><a href="{contractLink(config.provenanceContractName)}" target=_blank>Provenance contract on Prism</a></p>
<p><a href="{contractLink(config.namesContractName)}" target=_blank>Names contract on Prism</a></p>
<p><a href="https://github.com/orbs-network/provenance" target=_blank>Orbs Github</a></p>
</div>
