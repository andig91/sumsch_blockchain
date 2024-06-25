const {Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('2b07d1b9b96629ea5ae405cfe79aa06d564e2d74e4a167db9d5b2c655f24d16d');
const myWalletAddress = myKey.getPublic('hex');
console.log("Wallet Address: ", myWalletAddress);

const myKey2 = ec.keyFromPrivate('1d719ef5badd36dabeb6add51dd5672acd580ae50b68dbdf17187945b85aba0d');
const myWalletAddress2 = myKey2.getPublic('hex');
//TESTS:

let andiCoin = new Blockchain();

const tx1 = new Transaction(myWalletAddress, "public-address-receiver", 12);
tx1.signTransaction(myKey2);
andiCoin.addTransaction(tx1);

console.log("Balance of myWalletAddress: ", andiCoin.getBalanceOfAddress(myWalletAddress));
console.log("Mining Block 1...");
andiCoin.minePendingTransactions(myWalletAddress);
console.log("Balance of myWalletAddress: ", andiCoin.getBalanceOfAddress(myWalletAddress));
console.log();
console.log(JSON.stringify(andiCoin, null, 4));

console.log("Mining Block 1...");
andiCoin.minePendingTransactions(myWalletAddress);
console.log("Balance of myWalletAddress: ", andiCoin.getBalanceOfAddress(myWalletAddress));

console.log();
console.log("Is my Blockchain valid? " + andiCoin.isChainValid());




// console.log("Mining Block 1...");
// //andiCoin.addBlock(new Block(1,"25.06.2024.10:13", { amount: 3 }));
// //andiCoin.addBlock(new Block("25.06.2024.10:13", { amount: 3 }));
// andiCoin.createTransaction("Moritz","Daniel",12);
// andiCoin.createTransaction("Andi","Markus",62);
// andiCoin.createTransaction("Moritz","Daniel",42);
// andiCoin.minePendingTransactions("Andi");
// console.log("Mining Block 2...");
// //andiCoin.addBlock(new Block(2, "25.06.2024.10:25", { amount: 8 }));
// //andiCoin.addBlock(new Block("25.06.2024.10:25", { amount: 8 }));
// andiCoin.createTransaction(123455,456488,32);
// andiCoin.createTransaction(23115,456228,2);
// andiCoin.createTransaction(123455,456338,42);
// andiCoin.minePendingTransactions("Andi");
// // console.log("Mining Block 3...");
// //andiCoin.addBlock(new Block(3, "25.06.2024.10:26", { amount: 11 }));
// //andiCoin.addBlock(new Block("25.06.2024.10:26", { amount: 11 }));
// andiCoin.pendingTransactions.push(123455,456488,22);
// andiCoin.pendingTransactions.push(123115,456228,42);
// andiCoin.pendingTransactions.push(123455,456338,1);
// andiCoin.minePendingTransactions("Daniel");





// //console.log(JSON.stringify(andiCoin, null, 4));

// console.log();
// console.log("Is my Blockchain valid? " + andiCoin.isChainValid());
// console.log("The balance is: " + andiCoin.getBalanceOfAddress("Andi"));

// console.log();
// //console.log("Hack! change amount......");
// //andiCoin.chain[1].data = { amount: 100 };
// //console.log("Is my Blockchain valid? " + andiCoin.isChainValid());

