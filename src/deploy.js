const { Client, createAccount } = require("orbs-client-sdk");
const { ERC721, Provenance, deployERC721, deployProvenance } = require("orbs-erc721");
const { deploy: deployNames } = require("../names/deploy");
const paintings = require("./paintings.json");

async function transferOwnership(client, erc721ContractName, owner, nextOwner, tokenId) {
    const erc721 = new ERC721(client, erc721ContractName, owner.publicKey, owner.privateKey);
    await erc721.transferFrom(owner.address, nextOwner.address, tokenId);
}

async function deploy() {
    const client = new Client(
        process.env.ORBS_NODE_ADDRESS,
        process.env.ORBS_VCHAIN,
        "TEST_NET"
    );
    const owner = createAccount();

    const erc721ContractName = process.env.ORBS_ERC721 || "ERC721";
    const provenanceContractName = process.env.ORBS_PROVENANCE || "Provenance";
    const namesContractName = process.env.ORBS_NAMES || "Names";

    await deployERC721(client, owner, erc721ContractName);
    await deployProvenance(client, owner, provenanceContractName);
    await deployNames(client, owner, namesContractName);

    const erc721 = new ERC721(client, erc721ContractName, owner.publicKey, owner.privateKey);
    const provenance = new Provenance(client, provenanceContractName, owner.publicKey, owner.privateKey);
    await provenance.acceptTokens();
    await erc721.setCallbackContract(provenanceContractName);

    // Tell the story
    const tokenId = await erc721.mint(paintings[0]);

    const nextOwner1 = createAccount();
    const nextOwner2 = createAccount();
    const nextOwner3 = createAccount();
    const nextOwner4 = createAccount();
    const nextOwner5 = createAccount();

    await transferOwnership(client, erc721ContractName, owner, nextOwner1, tokenId);    
    await transferOwnership(client, erc721ContractName, nextOwner1, nextOwner2, tokenId);
    await transferOwnership(client, erc721ContractName, nextOwner2, nextOwner3, tokenId);
    await transferOwnership(client, erc721ContractName, nextOwner3, nextOwner4, tokenId);
    await transferOwnership(client, erc721ContractName, nextOwner4, nextOwner5, tokenId);
}

(async () => {
    try {
        await deploy();
        console.log("Success!");
    } catch (e) {
        console.log(e);
    }
})();

