const { argString, argBytes, argUint64, argUint32, argAddress, addressToBytes } = require("orbs-client-sdk");
const { isEmpty, uniq } = require("lodash");

function getErrorFromReceipt(receipt) {
    const value = receipt.outputArguments.length == 0 ? receipt.executionResult : receipt.outputArguments[0].value;
    return new Error(value);
}

class Names {
	constructor(orbsClient, contractName, publicKey, privateKey) {
		this.client = orbsClient;
		this.contractName = contractName;
		this.publicKey = publicKey;
		this.privateKey = privateKey;
	}

	async set(n) {
		const [ tx, txId ] = this.client.createTransaction(
			this.publicKey, this.privateKey, this.contractName,
			"set",
			[
				argString(n)
			]
		);

		const receipt = await this.client.sendTransaction(tx);
		if (receipt.executionResult !== 'SUCCESS') {
			throw getErrorFromReceipt(receipt);
		}
	}

	async get(addr) {
		const query = this.client.createQuery(
			this.publicKey,
			this.contractName,
			"get",
			[
                argAddress(addr)
            ]
		);

		const receipt = await this.client.sendQuery(query);
		if (receipt.executionResult !== 'SUCCESS') {
			throw getErrorFromReceipt(receipt);
		}

		return receipt.outputArguments[0].value;
    }
    
    async getAll(addresses) {
        const uniqueAddresses = uniq(addresses).map(argAddress);
		const query = this.client.createQuery(
			this.publicKey,
			this.contractName,
            "getAll",
            uniqueAddresses
		);

		const receipt = await this.client.sendQuery(query);
		if (receipt.executionResult !== 'SUCCESS') {
			throw getErrorFromReceipt(receipt);
		}

		return JSON.parse(receipt.outputArguments[0].value);
	}
}

module.exports = {
	Names
};
