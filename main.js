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

// const transaction =sendTransaction.getTransactionInfo("0xdd0363fe75a866c8307e8123c19ec4d5085ceafc5868919a6de268cb20458b25").then(console.log)

const transaction = async () => {
  const amount = await sendTransaction.amountContractCalculator(0.0001);
  console.log(amount);
  const transaction = await sendTransaction
    .addressTransfer(
      "0x250179aaf42F1B4d2d3f4988b9Fe7347879e11a6",
      amount,
      "0x0c007e0dDb01082A2Db1212Bd7ed0F00Bb127650"
    )
    .then((confirmation) => {
      sendTransaction.getTransactionInfo(confirmation.receipt.transactionHash).then(console.log);
    });
// const receipt=await sendTransaction.getTransactionReceipt("0x510333db754459c32ea112aad308d1d940300a9dcca7fa628b4f79c1bee45639").then(console.log);
};

transaction();
