## Documentation on how to use index.js


## Import index.js
```
const web3 = require("path/to/index.js");
```



## Method List
> This are the available method you can use in index.js 
> 
> Y =Yes ,N=No
> 
|Methods|Returns|async|
|-------|-------|-----|
|sendMintme(String toAddress,double amount)|Promise:Json Data|Y|
|addressTransfer(String toAddress,double amount,String contractAddress)|Promise:Json Data|Y|
|createWallet(String<=32 randomString)|Promise:Json Data|Y|
|amountContractCaculator(double amount)|Int 12 digit gwie converted amount|Y|
|getTransactionInfo(32bytes hash)|Promise:Json Data|Y|
|generateString(void)|Random String 32 character string|Y|
|amountMintmeCalculator(double amount)|Int 18 digit gwie converted amount|Y|

> More info will be updated here ! 
