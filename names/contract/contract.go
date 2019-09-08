package main

import (
	"encoding/hex"
	"encoding/json"

	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/address"
	"github.com/orbs-network/orbs-contract-sdk/go/sdk/v1/state"
)

var PUBLIC = sdk.Export(set, get, getAll)
var SYSTEM = sdk.Export(_init)

func _init() {

}

func set(name string) {
	state.WriteString(address.GetSignerAddress(), name)
}

func get(addr []byte) string {
	return state.ReadString(addr)
}

func getAll(addresses ...[]byte) string {
	results := make(map[string]string)
	for _, addr := range addresses {
		if value := state.ReadString(addr); value != "" {
			results["0x"+hex.EncodeToString(addr)] = value
		}
	}

	rawJson, _ := json.Marshal(results)
	return string(rawJson)
}
