const { Client, createAccount } = require("orbs-client-sdk");
const { ERC721, Provenance, deployERC721, deployProvenance } = require("orbs-erc721");
const { deploy: deployNames } = require("../names/deploy");
const { tellAStory, setName } = require("./story");
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
    const config = {
        erc721ContractName,
        namesContractName
    };
    await setName(client, owner, config);
    const tokenId = await tellAStory(client, owner, paintings[0], config, console.log);
}

(async () => {
    try {
        await deploy();
        console.log("Success!");
    } catch (e) {
        console.log(e);
    }
})();

