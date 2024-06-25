const SHA256 = require("crypto-js/sha256");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey) {
        if (signingKey.getPublic('hex') !== this.fromAddress) {
            throw new Error("ERROR: cannot sign transactions for other walltes!");
        }
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid() {
        if (this.fromAddress === null) return true; //reward

        if (!this.signature || this.signature.length === 0) {
            throw new Error("ERROR: No signature in this transaction!");
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
        //check if calculateHash is signed by the signature
    }
    
}

class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; //Nonce Value for hashing
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++; // To prevent endless loop
            //console.log("The actual Nonce value: " + this.nonce);
            this.hash = this.calculateHash();
            if ((this.nonce%1000000) === 0) {
                console.log("The actual Nonce value: " + this.nonce);
            } 
        }
        console.log("BLOCK MINED: " + this.hash + " Nonce value: " + this.nonce);
        
    }

    hasValidTransactions() {
        for(const tx of this.transactions) {
            if(!tx.isValid()) {
                return false;
            }
        }
        return true;
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = []; //MemPool
        this.miningReward = 50;
    }

    createGenesisBlock() {
        return new Block(0, "25.06.2024", [], "0"); // kein vogehender Block dh. prev.hash 0
    }

    getLatestBlock() {

        //return this.chain[this.chain.length - 1];                   //Länge - 1 ist das letzte Element im Array
        return this.chain.at(-1);                   //Länge - 1 ist das letzte Element im Array
    }

    // addBlock(newBlock) {

    //     newBlock.previousHash = this.getLatestBlock().hash;         //Hash vom vorherigen Block in previousHash schreiben
    //     //newBlock.hash = newBlock.calculateHash();                   //Berechnet Hash für den neu erzeugten Block
    //     newBlock.mineBlock(this.difficulty);                   //Berechnet Hash für den neu erzeugten Block
    //     //newBlock.hash = newBlock.calculateHash();                   //Berechnet Hash für den neu erzeugten Block
    //     this.chain.push(newBlock);                                  //pusht neuen Block in die Chain

    // }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        block.mineBlock(this.difficulty);
        console.log("Block successfully mined!");
        this.chain.push(block);   
        this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)];
    }

    addTransaction(transaction) {
        if(!transaction.fromAddress || !transaction.toAddress) {
            throw new Error("ERROR: Transaction must include a fromAddress and a toAddress!")
        }

        if(!transaction.isValid()) {
            throw new Error("ERROR: Transaction must include a fromAddress and a toAddress!")
        }

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            //console.log(JSON.stringify(block, null, 4));
            for (const transaction of block.transactions) {
                //console.log(JSON.stringify(transaction, null, 4));
                //console.log(transaction.fromAddress + " " + transaction.fromAddress + " " +  transaction.amount)
                if (transaction.fromAddress === address) {
                    balance -= transaction.amount;
                }
                if (transaction.toAddress === address) {
                    balance += transaction.amount;
                }
            }
        }
        return balance;
    }

    isChainValid() {

        for (let i = 1; i < this.chain.length; i++) {

            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (!currentBlock.hasValidTransactions()) {
                return false;
            }

            if (currentBlock.hash != currentBlock.calculateHash()) {

                console.log(currentBlock.hash);
                console.log(currentBlock.calculateHash());
                return "First Check: " + i + " false";

            }

            if (currentBlock.previousHash != previousBlock.hash) {

                console.log(currentBlock.previousHash);
                console.log(previousBlock.calculateHash());
                return "Second Check: " + i + " false";

            }

        }

        return true;

    }
}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
//module.export.Block = Block;