const { Web3 } = require("web3");
var Tx = require("@ethereumjs/tx");
const { Common, Chain, Hardfork } = require('@ethereumjs/common')
// var conf = require("./config/conf.json");
const fs = require("fs");

const dotenv = require("dotenv");
dotenv.config();

const rpc_url = process.env.RPC_URL;
//Assign sender address
const senderAddress = process.env.senderAddress;
const senderPrivateKey = process.env.senderPrivateKey;
const password = process.env.PASSWORD;

// Blockchain configuration for the transfer.
const customCommon = new Common({
  chain: Chain.Mainnet,
  hardfork: Hardfork.Petersburg,
  name: "MINTME",
  networkId: 37129,
  chainId: 24484,
});
// Contracr ERC20 Default ABI
const abi = fs.readFileSync("./utils/ERC20.json");
const ABI = JSON.parse(abi);
//Connect to mintme node
console.log(rpc_url, senderPrivateKey, senderAddress);
const node = new Web3(rpc_url);

// Sender private key in hexadecimal
var privateKeyHex = Buffer.from(senderPrivateKey, "hex");
async function sendMintme(address, amount) {
  //get and check balance
  const balance = await getMintmeBalance(senderAddress);
  if (balance < amount) {
    return false;
  }
  //Get latest block from block chain
  let block = await node.eth.getBlock("latest");
  //Get gas price base from latest block
  let gasPrice = await node.eth.getGasPrice();
  //Get transaction count of the wallet
  let nonce = await node.eth.getTransactionCount(senderAddress);
  //Get gas limit and devide it into half
  let gasLimit = (block.gasLimit / 50).toFixed();
  // Let's convert all the results to hexadecimal
  nonce = await Web3.utils.toHex(nonce);
  gasPrice = await Web3.utils.toHex(gasPrice * 2);
  gasLimit = await Web3.utils.toHex(gasLimit);
  //Create a transaction configuration
  transaction = {
    from: senderAddress,
    to: address,
    value: amount,
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: gasLimit,
  };
  //Create a tx transaction
  var tx = new Tx(transaction, { common: customCommon });
  //Sign the transaction with privatekey
  tx.sign(privateKeyHex);
  //Serialize the tx
  const stx = tx.serialize();
  //Final signing and converting serialized tx to hex
  const signed = "0x" + stx.toString("hex");
  //Send sign transaction to network to be mined and processed return recipt containing transaction detail
  return await node.eth.sendSignedTransaction(signed);
}

//Get mintme balance on address it is in 18 decimal
async function getMintmeBalance(address) {
  var bal = await node.eth.getBalance(address);
  return bal;
}

// Function to obtain the token balance of an address return 12 decimal for token
async function getAccountBalance(address, tokencontract) {
  // Contract erc20 instance
  const Contract = new node.eth.Contract(ABI, tokencontract, {
    from: senderAddress,
  });

  let decimals = await Contract.methods
    .decimals()
    .call()
    .catch((err) => {});
  let response = await Contract.methods
    .balanceOf(address)
    .call()
    .catch((err) => {
      console.log(err);
    });
  return response;
}

async function addressTransfer(address, amount, tokenContract) {
  return new Promise(async (resolve, reject) => {
    // Contract erc20 instance
    const Contract = new node.eth.Contract(ABI, tokenContract, {
      from: senderAddress,
    });
    Contract.options.address = tokenContract;
    // Transaction data.
    let transaction;
    // Check if the shipping address has enough tokens
    const balance = await getAccountBalance(senderAddress, tokenContract);

    if (amount > balance)
      return console.log(
        `You don't have enough tokens to send.Total Balance:` +
          balance +
          "Amount to send:" +
          amount
      );
    // Encode ABI Transfer
    let data = await Contract.methods.transfer(address, amount).encodeABI();

    // Get the transfer configuration from the blockchain.
    let block = await node.eth.getBlock("latest");
    let gasPrice = await node.eth.getGasPrice();

    let nonce = await node.eth.getTransactionCount(senderAddress);
    let gasLimit = block.gasLimit;
    // Let's convert all the results to hexadecimal
    nonce = await Web3.utils.toHex(nonce);
    gasPrice = await Web3.utils.toHex(gasPrice);
    gasLimit = await Web3.utils.toHex(gasLimit);
    //Create transaction data
    transaction = {
      from: senderAddress,
      nonce: nonce,
      gasPrice: gasPrice,
      gasLimit: gasLimit,
      value: 0,
      data: data,
      to: tokenContract,
    };
    // // We create the transaction and sign it with the key of the address that sends the tokens
    // var tx = new Tx(transaction, { common: customCommon });
    // //sign with private key
    // tx.sign(privateKeyHex);
    // //Serialize tx
    // const stx = tx.serialize()
    // //Final signing then converto hex
    // const signed = '0x' + stx.toString('hex');
    const signing = await node.eth.accounts.signTransaction(
      transaction,
      senderPrivateKey
    );
    // Send the transaction to the blockchain to be mined.
    transaction = node.eth
      .sendSignedTransaction(signing.rawTransaction)
      .on("sending", (sending) => {
        console.log("Transaction being sent");
      })
      .on("sent", (sent) => {
        console.log("Transaction sent");
      })
      .on("transactionHash", (transactionHash) => {
        console.log("Transaction hash generated.");
      })
      .on("receipt", (receipt) => {
        console.log("Receipt generated.");
      })
      .on("confirmation", (confirmation) => {
        return resolve(confirmation);
      })
      .on("error", (error) => {
        return reject(error);
      });
  });
}

//Get transaction information of txhash
async function getTransactionInfo(transactionhash) {
  var transactioninfo = await node.eth.getTransaction(transactionhash);
  return transactioninfo;
}

async function subscribe() {
  node.eth.subscribe("pendingTransactions", (err, result) => {
    if (err) console.log(err);
    console.log(result);
  });
}

async function amountMintmeCalculator(amount) {
  // Amount of tokens sent to the user in Wei
  var valueInWei = 1000000000000000000 * amount;
  // 1 Token (picoether) - 12 decimals

  return valueInWei;
}
async function amountContractCalculator(amount) {
  // Amount of tokens sent to the user in Wei
  var valueInWei = 1000000000000 * amount;
  // 1 Token (picoether) - 12 decimals

  return valueInWei;
}

async function generateString() {
  var string = "";
  var chars =
    "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!#%".split(
      ""
    );

  for (var i = 0; i < 32; i++) {
    var num = Math.floor(Math.random() * (chars.length - 0)) + 0;
    string = string + chars[num];
  }

  return string;
}

async function createWallet(string) {
  let wallet = node.eth.accounts.wallet.create(1, string);
  return wallet;
}

async function getTransactionReceipt(transactionHash) {
  return await node.eth.getTransactionReceipt(transactionHash);
}

module.exports = {
  sendMintme,
  addressTransfer,
  amountMintmeCalculator,
  createWallet,
  amountContractCalculator,
  getTransactionInfo,
  generateString,
  subscribe,
  getTransactionReceipt,
};
