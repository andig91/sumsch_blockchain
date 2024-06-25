const SHA256 = require("crypto-js/sha256");

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }


}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 6;
    }

    createGenesisBlock() {
        return new Block(0, "25.06.2024", "Genesis Block", "0"); // kein vogehender Block dh. prev.hash 0
    }

    getLatestBlock() {

        //return this.chain[this.chain.length - 1];                   //Länge - 1 ist das letzte Element im Array
        return this.chain.at(-1);                   //Länge - 1 ist das letzte Element im Array
    }

    addBlock(newBlock) {

        newBlock.previousHash = this.getLatestBlock().hash;         //Hash vom vorherigen Block in previousHash schreiben
        newBlock.hash = newBlock.calculateHash();                   //Berechnet Hash für den neu erzeugten Block
        this.chain.push(newBlock);                                  //pusht neuen Block in die Chain

    }

    isChainValid() {

        for (let i = 1; i < this.chain.length; i++) {

            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash != currentBlock.calculateHash()) {

                return false;

            }

            if (currentBlock.previousHash != previousBlock.calculateHash()) {

                return false;

            }

        }

        return true;

    }
}

let andiCoin = new Blockchain();
console.log("Mining Block 1...");
andiCoin.addBlock(new Block(1, "25.06.2024.10:13", { amount: 3 }));
console.log("Mining Block 2...");
andiCoin.addBlock(new Block(2, "25.06.2024.10:25", { amount: 8 }));
console.log("Mining Block 3...");
andiCoin.addBlock(new Block(3, "25.06.2024.10:26", { amount: 11 }));

console.log(JSON.stringify(andiCoin, null, 4));
console.log("Is my Blockchain valid? " + andiCoin.isChainValid());

console.log();
console.log("Hack! change amount......");
andiCoin.chain[1].data = { amount: 100 };
console.log("Is my Blockchain valid? " + andiCoin.isChainValid());

