<script>
  import { first, map, union } from "lodash";
  import Management from "./Management.svelte";
  import Message from "./Message.svelte";
  import * as moment from "moment";

  export let client;
  export let erc721;
  export let provenance;
  export let names;
  
  export let erc721ContractLink;
  export let provenanceContractLink;
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

  const handleMessage = (event) => {
    const { type, tokenId, message: msg } = event.detail;

    if (type === "tokenId") {
        updateResults(tokenId);
    }

    if (type === "message") {
        message = msg;
    }
  }

  const getName = async () => {
    let myName = await names.get(owner.address);
    if (myName === "") {
        myName = Chance().name({ nationality: "en" });
        await names.set(myName);
    }

    return myName;
  }

  const addressToName = (addr) => {
      return nameRegistry[addr.toLowerCase()] || addr;
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

.login {
    z-index: 10;
    float: right;
    padding: 30px;
}

.login .name {
    text-decoration: underline dotted;
}
</style>

<Management
    client={client}
    erc721={erc721}
    owner={owner}
    config={config}
    on:message={handleMessage} />
<Message message={message} />

{#await getName()}
<!-- -->
{:then myName}
<div class="login">
Signed in as<br/><span class="name" title="{owner.address}">{myName}</span>
</div>
{/await}

<div class="content">
{#if metadata }
    <div class="metadata">
    <h1>{metadata.name}</h1>
    <img src="{metadata.image}" alt="{metadata.name}">
    <p><span class="tokenDetails">TokenId:</span> {tokenId}</p>

    {#if provenanceHistory && nameRegistry && tokenOwner }
    <p><span class="tokenDetails">Owner:</span> <span class="address" title="{tokenOwner}">{addressToName(tokenOwner)}</span></p>
    <p><span class="tokenDetails">First owner:</span> <span class="address" title="{first(provenanceHistory).To}">{addressToName(first(provenanceHistory).To)}</span></p>
    {/if}

    <p>{metadata.description}</p>
</div>
{/if}

{#if provenanceHistory && nameRegistry}
    <div class="provenance">
    <h2>Provenance</h2>
    {#each provenanceHistory as {From, To, Timestamp}}
        {#if From == "0x"}
        <p>On {formatTime(Timestamp)} item created by <span class="address" title="{To}">{addressToName(To)}</span></p>
        {:else}
        <p>On {formatTime(Timestamp)} ownership transferred from <span class="address" title="{From}">{addressToName(From)}</span> to <span class="address" title="{To}">{addressToName(To)}</span></p>
    {/if}
    {/each}
</div>
{/if}

<hr>
<p><a href="{erc721ContractLink}" target=_blank>ERC721 contract on Prism</a></p>
<p><a href="{provenanceContractLink}" target=_blank>Provenance contract on Prism</a></p>
<p><a href="https://github.com/orbs-network/provenance" target=_blank>Orbs Github</a></p>
</div>
