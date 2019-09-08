const Chance = require("chance");
const { createAccount } = require("orbs-client-sdk");
const { ERC721 } = require("orbs-erc721");
const { Names } = require("../names/names");
const { random } = require("lodash");
  

async function transferOwnership(client, erc721ContractName, owner, nextOwner, tokenId) {
    const erc721 = new ERC721(client, erc721ContractName, owner.publicKey, owner.privateKey);
    return erc721.transferFrom(owner.address, nextOwner.address, tokenId);
}

async function setName(client, account, config) {
    const names = new Names(client, config.namesContractName, account.publicKey, account.privateKey);
    return names.set(Chance().name({ nationality: 'en' }))
}

async function tellAStory(client, owner, painting, config, message) {
    let previousOwner = createAccount();
    await setName(client, previousOwner, config);
    
    const mintingERC721 = new ERC721(client, config.erc721ContractName, previousOwner.publicKey, previousOwner.privateKey);
    message(`Minting new token for ${painting.name}`);
    const tokenId = await mintingERC721.mint(painting);

    for (let i = 0, max = random(3, 6); i < max; i++) {
      let nextOwner;
      if (i == max - 1) {
        nextOwner = owner; // always transfer to the caller in the end
      } else {
        nextOwner = createAccount();
        await setName(client, nextOwner, config, tokenId);
      }
      message(`Transferring ownership from ${previousOwner.address} to ${nextOwner.address}`);
      await transferOwnership(client, config.erc721ContractName, previousOwner, nextOwner, tokenId);

      previousOwner = nextOwner;
    }

    message(`${painting.name} registered successfully`);

    return tokenId;
}

module.exports = {
    transferOwnership,
    setName,
    tellAStory
}