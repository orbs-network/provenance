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

const erc721 = new ERC721(orbsClient, "ERC721", publicKey, privateKey);
const provenance = new Provenance(orbsClient, "Provenance", publicKey, privateKey);

const app = new App({
  target: document.body,
  props: {
    erc721,
    provenance,
  }
});

export default app;
