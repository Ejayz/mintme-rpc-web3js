var sendTransaction = require("./index");
/* sendTransaction.generateString().
    then(phrase => sendTransaction.createWallet(phrase).
        then(wallet => {
            console.log(wallet.length);
            console.log("Key Phrase:" + phrase);
            console.log("Wallet Address:" + wallet[0].address);
            console.log("Wallet PrivateKey:" + wallet[0].privateKey);
        })); */



//Pass the amount to amountMintmeCalculator. Will convert it to 18 decimal amount or gwie
/* sendTransaction.amountMintmeCalculator(1)
    //Send a transaction providing the address where you want to send it and the amount you want to send
    .then(amount => sendTransaction.sendMintme("0xcbb4558174343FcF1F93f63bE9a9Af36161faA0c", amount)
        .then(txhash => console.log(txhash))); */

sendTransaction.getTransactionInfo("0xfc5dc42b2a93b01fa948de575b82ec4eaa445b43ada89443c3532ee5e5d6c5cb").then(console.log);

sendTransaction.subscribe()
 