import App from "./App.svelte";
import { ERC721, Provenance } from "orbs-erc721";
import {
  createAccount,
  Client,
  encodeHex,
  decodeHex
} from "orbs-client-sdk";

const SENDER_PUBLIC_KEY = "sender_public_key";
const SENDER_PRIVATE_KEY = "sender_private_key";
const SENDER_ADDRESS = "sender_address";

if (!localStorage.getItem(SENDER_PUBLIC_KEY)) {
  const sender = createAccount();
  localStorage.setItem(SENDER_PUBLIC_KEY, encodeHex(sender.publicKey));
  localStorage.setItem(SENDER_PRIVATE_KEY, encodeHex(sender.privateKey));
  localStorage.setItem(SENDER_ADDRESS, sender.address);
}

const publicKey = decodeHex(localStorage.getItem(SENDER_PUBLIC_KEY));
const privateKey = decodeHex(localStorage.getItem(SENDER_PRIVATE_KEY));
const address = localStorage.getItem(SENDER_ADDRESS);
const orbsClient = new Client(
  process.env.ORBS_NODE_ADDRESS,
  process.env.ORBS_VCHAIN,
  "TEST_NET"
);

const erc721ContractName = process.env.ORBS_ERC721 || "ERC721";
const erc721 = new ERC721(orbsClient, erc721ContractName, publicKey, privateKey);

const provenanceContractName = process.env.ORBS_PROVENANCE || "Provenance";
const provenance = new Provenance(orbsClient, provenanceContractName, publicKey, privateKey);

const contractLink = (contractName) => `${process.env.ORBS_PRISM_URL}/vchains/${process.env.ORBS_VCHAIN}/contract/${contractName}`;

const app = new App({
  target: document.body,
  props: {
    client: orbsClient,
    erc721,
    provenance,
    erc721ContractLink: contractLink(erc721ContractName),
    provenanceContractLink: contractLink(provenanceContractName),
    owner: {
      address,
      publicKey,
      privateKey
    }
  }
});

export default app;
