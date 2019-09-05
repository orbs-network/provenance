<script>  
  export let erc721;
  export let provenance;
  export let tokenId;

  let metadata;
  let provenanceHistory;

  const resetResults = () => {
    metadata = undefined;
    provenanceHistory = undefined;
  };

  const updateResults = async () => {
    resetResults();    
    try {
      metadata = await erc721.tokenMetadata(tokenId);
      provenanceHistory = await provenance.provenance(tokenId);
    } catch (err) {
      console.error(err);
    }
  };

  tokenId = 0n;
  updateResults();
</script>

<style>
  
</style>

<div class="content-container">
<pre>
{JSON.stringify(metadata, 2, 2)}
</pre>

<pre>
{JSON.stringify(provenanceHistory, 2, 2)}
</pre>
</div>
