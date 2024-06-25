const SHA256 = require("crypto-js/sha256");

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
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
        console.log("Block usccessfully mined!");
        this.chain.push(block);   
        this.pendingTransactions = [new Transaction(null, miningRewardAddress, this.miningReward)];
    }

    createTransaction(toAddress, fromAddress, amount) {
        this.pendingTransactions.push(new Transaction(toAddress, fromAddress, amount));
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

let andiCoin = new Blockchain();
console.log("Mining Block 1...");
//andiCoin.addBlock(new Block(1,"25.06.2024.10:13", { amount: 3 }));
//andiCoin.addBlock(new Block("25.06.2024.10:13", { amount: 3 }));
andiCoin.createTransaction("Moritz","Daniel",12);
andiCoin.createTransaction("Andi","Markus",62);
andiCoin.createTransaction("Moritz","Daniel",42);
andiCoin.minePendingTransactions("Andi");
console.log("Mining Block 2...");
//andiCoin.addBlock(new Block(2, "25.06.2024.10:25", { amount: 8 }));
//andiCoin.addBlock(new Block("25.06.2024.10:25", { amount: 8 }));
andiCoin.createTransaction(123455,456488,32);
andiCoin.createTransaction(23115,456228,2);
andiCoin.createTransaction(123455,456338,42);
// andiCoin.minePendingTransactions(123123);
// console.log("Mining Block 3...");
//andiCoin.addBlock(new Block(3, "25.06.2024.10:26", { amount: 11 }));
//andiCoin.addBlock(new Block("25.06.2024.10:26", { amount: 11 }));
//andiCoin.pendingTransactions.push(123455,456488,22);
//andiCoin.pendingTransactions.push(123115,456228,42);
//andiCoin.pendingTransactions.push(123455,456338,1);
andiCoin.minePendingTransactions(123123);





//console.log(JSON.stringify(andiCoin, null, 4));

console.log();
console.log("Is my Blockchain valid? " + andiCoin.isChainValid());
console.log("The balance is: " + andiCoin.getBalanceOfAddress("Andi"));

console.log();
//console.log("Hack! change amount......");
//andiCoin.chain[1].data = { amount: 100 };
//console.log("Is my Blockchain valid? " + andiCoin.isChainValid());

