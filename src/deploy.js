const { Client, createAccount } = require("orbs-client-sdk");
const { ERC721, Provenance, deployERC721, deployProvenance } = require("orbs-erc721");

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

    const erc721ContractName = "ERC721";
    const provenanceContractName = "Provenance";

    await deployERC721(client, owner, erc721ContractName);
    await deployProvenance(client, owner, provenanceContractName);

    const erc721 = new ERC721(client, erc721ContractName, owner.publicKey, owner.privateKey);
    const provenance = new Provenance(client, provenanceContractName, owner.publicKey, owner.privateKey);
    await provenance.acceptTokens();
    await erc721.setCallbackContract(provenanceContractName);

    // Tell the story
    const tokenId = await erc721.mint({
        "title": "Asset Metadata",
        "type": "Painting",
        "properties": {
            "name": {
                "type": "Black Square",
                "description": "Identifies the asset to which this NFT represents"
            },
            "description": {
                "type": "string",
                "description": "Authored by Kazimir Malevich"
            },
            "image": {
                "type": "string",
                "description": "https://upload.wikimedia.org/wikipedia/commons/d/dc/Kazimir_Malevich%2C_1915%2C_Black_Suprematic_Square%2C_oil_on_linen_canvas%2C_79.5_x_79.5_cm%2C_Tretyakov_Gallery%2C_Moscow.jpg"
            }
        }
    });

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

