function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}
document.getElementById("BTC").click();
     
/*******************************Подключение к метамаск**********************************************/
// let send_button = document.getElementById("send_button");

// let initialization = false;
// let ether;

// let idAddress = document.getElementById("address");
// let idBalans = document.getElementById("balance");

// send_button.addEventListener("click", async () => {
//     await init();
//     //console.log(account);
    
//     let balanse = await ether.request({
//         method: 'eth_getBalance',
//         params: [account]
//     });
//     let bal = (parseInt(balanse, 16) / 10 ** 18).toFixed(4);
//     idBalans.innerHTML = bal;
//     idAddress.innerHTML = account;
    
//     let Exit = await window.ethereum.request({
//     method: "eth_requestAccounts",
//     params: [account]
// });
// });

// let init = async () => {
    
//     if(window.ethereum){
//         ether = window.ethereum;
//         const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
//             .catch((err) => {
//             if (err.code === 4001) {
//                 console.log('Please connect to MetaMask.');
//             } else {
//                 console.error(err);
//             }
//         });
//         account = accounts[0];
//         initialization = true;
        
        
//     }else{
//         console.log('установите метамаск');
//     }
// }
/***************************************ETH*********************************************/
let send_button = document.getElementById("send_button");
let idAddress = document.getElementById("address");
let idBalans = document.getElementById("balance");
let From            = '0xEf31f3F748cA2e2C5006a03032861C783e5a146f';
const private_key   = '63f6b2e24ad6e6bef8356ddcf98dde500209ce75e6672bc4998c4d84dce0c75a';

const web3 = new Web3(new Web3.providers.HttpProvider("https://sepolia.infura.io/v3/df9f3f829d434d08bf57348289f6720b"));
// web3.eth.getBlockNumber().then(console.log);
// console.log(web3.eth.accounts);
async function Balance() {

    let balance = await web3.eth.getBalance(From);
    let result = web3.utils.fromWei(balance, 'ether');
    idBalans.innerHTML = result.substr(0, 6);
    idAddress.innerHTML = From;
}
Balance();

send_button.addEventListener("click", async () => {
    let transferAd = document.getElementById('transfer_address').value;
    let transferAm = document.getElementById('transfer_amount').value;
    var val = web3.utils.toWei(transferAm, 'ether');

    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = 3000000;
    
    var SignerTransaction = await web3.eth.accounts.signTransaction({
        from: From,
        to: transferAd,
        value: val,
        gasPrice: web3.utils.toHex(gasPrice),
        gasLimit: web3.utils.toHex(gasLimit),
        data: ""
    }, private_key);

    web3.eth.sendSignedTransaction(SignerTransaction.rawTransaction).then(
    (receipt) => {
        document.getElementById('transfer_address').value = '';
        document.getElementById('transfer_amount').value = '';
        Balance();
        console.log(receipt);
    });
});
/-----------------------------------ERC20-----------------------------------------------/
let send_button_erc20 = document.getElementById("send_button_erc");
let idAddress_erc20 = document.getElementById("address_erc20");
let idBalans_erc20 = document.getElementById("balance_erc20");
let symbol_token = document.getElementById("currency_erc20");

// const tokenContract = "0x7c60c997bF4DBa5d912C24760dD34E5c61eab6d1";
// const tokenHolder = "0xEf31f3F748cA2e2C5006a03032861C783e5a146f";
// var contract_vlb = new web3.eth.Contract(ABI, tokenContract);
const contractAddress = '0x7c60c997bF4DBa5d912C24760dD34E5c61eab6d1';
const privateKey      = '63f6b2e24ad6e6bef8356ddcf98dde500209ce75e6672bc4998c4d84dce0c75a';
const ownerAddress    = "0xEf31f3F748cA2e2C5006a03032861C783e5a146f";
var contract = new web3.eth.Contract(ABI, contractAddress, {from: ownerAddress} );

async function Balance_erc20() {

    const balance_erc20 = await contract.methods.balanceOf(ownerAddress).call();
    let balance_vlb = balance_erc20.toString().slice(0, 3);
    const symb = await contract.methods.symbol().call();

    idBalans_erc20.innerHTML = balance_vlb;
    symbol_token.innerHTML = symb;
    idAddress_erc20.innerHTML = ownerAddress;
    /---------------------------Средняя цена за газ -----------------------------------------/
    web3.eth.getGasPrice().then((result) => {
       // console.log(web3.utils.fromWei(result, 'ether'))
    }); 
    
    /-----------------------------------------------------------------------------------------/
    send_button_erc20.addEventListener("click", async () => {
        let toAddress       = document.getElementById('transfer_address_erc').value;
        let transferAm_erc  = document.getElementById('transfer_amount_erc').value;
        var value = web3.utils.toWei(transferAm_erc, 'ether');

        var data = contract.methods.transfer(toAddress, value).encodeABI();

        const nonce = await web3.eth.getTransactionCount(ownerAddress);
        const gasPrice = await web3.eth.getGasPrice();
        const gasLimit = 3000000;
        // const block = await web3.eth.getBlock();
        //     console.log("block.gasLimit: " + block.gasLimit);
        // const gasPrice2 = await web3.eth.getGasPrice() + BigInt(1900000000);
        // console.log("gasPrice2: " + gasPrice2);
        var rawTransaction = {
                nonce: nonce,
                to: contractAddress,
                gasPrice: web3.utils.toHex(gasPrice),
                gasLimit: web3.utils.toHex(gasLimit),
                data: data,
            }; 

        web3.eth.accounts.signTransaction(rawTransaction, privateKey)
            .then(signedTx => web3.eth.sendSignedTransaction(signedTx.rawTransaction))
            .then(req => { 
                    //getTOKENBalanceOf(toAddress).then ( balance => { console.log(toAddress + " Token Balance: " + web3.utils.fromWei(balance, 'ether'));});
                        document.getElementById('transfer_address_erc').value = '';
                        document.getElementById('transfer_amount_erc').value = '';
                        Balance_erc20();
                        console.log(req);
                    return true;  
            });

        // async function getTOKENBalanceOf(address){
        //     return await contract.methods.balanceOf(address).call();                    
        // };
    });
}
Balance_erc20();
/----------------------------------------------------BTC------------------------------------------------------------/
let send_button_btc         = document.getElementById("send_button_btc");
let Balans_btc              = document.getElementById("balance_btc");
let Address_btc             = document.getElementById("address_btc");
let currency_btc            = document.getElementById("currency_btc").innerHTML;


const BTC_ADDRESS                 = "mtaAy2Q1pTcf1MzrCmQxUdLRjtQJNZHEdY";
const BTC_PUBLIC_KEY              = "02c85d4ebcf6f4d96fa97934c22ea7fdb9c744b532ca9df8a0aeb8179a526e5bec";
const BTC_PRIVATE_KEY             = "406cd75582df9ed0645c6ee5c3965639120f29e4762970af85867cc1bfd86889";


$.get('https://api.blockcypher.com/v1/btc/test3/addrs/' + BTC_ADDRESS)
  .then(function(Data) {
    let balance = Data.balance;
    let Balance = sb.toBitcoin(Data.balance);
    Balans_btc.innerHTML = Balance;
    Address_btc.innerHTML = BTC_ADDRESS;
});


// document.getElementById("transfer_address_btc").value = "mtk5BHgPA1xJPCuv4JYqKqake5iCb32kGr";
// document.getElementById("transfer_amount_btc").value = 0.0001;


send_button_btc.addEventListener("click", function (){



    let apiUrl = "https://tehnadzor.cc/111/php-client/sample/a.php";
    
    let address_btc = document.getElementById("transfer_address_btc").value;
    let TrAmBtc = document.getElementById("transfer_amount_btc").value;

    let amount_btc = TrAmBtc * 100000000;

        // const recipientAddress = address_btc; // Адрес получателя   
        // const amountToSend = amount_btc; // Сумма для отправки


        var data = {
            recipientAddress: address_btc,
            amountToSend: amount_btc
          };
          $.post(apiUrl, data)
            .then(function(response) {
                console.log(response);
                //location.reload();
            });        

});
/-------------------------------------------------------BNB--------------------------------------------------------------/

    const url_bnb       = 'https://rpc.ankr.com/bsc_testnet_chapel/c8607a494011abebca165566c899720909246b55f29c7f7376ab049b6cf099ca';
    let addressBNB     = '0x8C78e4eb33896Dfc7E4ce7D50F0144cA1EaC1eC9';
    let send_button_bnb = document.getElementById("send_button_bnb");
    // let BnbPrivateKey   = "0x28a84aaa502aed03b40b5864292c0ca6c425ea376e1f2df849136f5a739d3d62";
    let idAddress_bnb   = document.getElementById("address_bnb");
    let idBalans_bnb    = document.getElementById("balance_bnb");

    const web3_bnb = new Web3(new Web3.providers.HttpProvider(url_bnb));

async function Balance_bnb() {

    let result = await web3_bnb.eth.getBalance(addressBNB);
    let balance_bnb = web3_bnb.utils.fromWei(result, 'ether').slice(0, -13);
    idBalans_bnb.innerHTML = balance_bnb;
    idAddress_bnb.innerHTML = addressBNB;

    // checksum_address = Web3.utils.toChecksumAddress(address_bnb);
    // balance = await web3_bnb.eth.getBalance(checksum_address);
    // console.log(balance);
}
Balance_bnb();


    document.getElementById("transfer_address_bnb").value = '0xA337280823Bb5F816177Db1df51Ff9dbe0d897D9';
    //document.getElementById("transfer_amount_bnb").value = 0.015;


async function main_bnb(address_bnb, amount_bnb) {

    let BnbPrivateKey   = "0x28a84aaa502aed03b40b5864292c0ca6c425ea376e1f2df849136f5a739d3d62";
    //console.log(amount_bnb);
    //let url = "https://rpc.ankr.com/bsc_testnet_chapel/ws/c8607a494011abebca165566c899720909246b55f29c7f7376ab049b6cf099ca";
    //let apiUrl2 = "http://localhost:3000/submit2";
    //let val_bnb = web3_bnb.utils.fromWei(amount_bnb, 'ether');
    let val = amount_bnb * 1000000000000000000;

    const gas_price = await web3_bnb.eth.getGasPrice();
    gas = 2000000;
    nonce = await web3_bnb.eth.getTransactionCount(addressBNB);
    chain_id = await web3_bnb.eth.getChainId();
    txn = {
        'chainId': chain_id,
        'from': addressBNB,
        'to': "0xA337280823Bb5F816177Db1df51Ff9dbe0d897D9",
        'value': val,
        'nonce': nonce, 
        'gasPrice': gas_price,
        'gas': gas,
    }

            signed_txn = await web3_bnb.eth.accounts.signTransaction(txn, BnbPrivateKey);
            txn_result = await web3_bnb.eth.sendSignedTransaction(signed_txn.rawTransaction);
            console.log(txn_result);
            console.log("Hash transaction -  ", txn_result.transactionHash);

                // $.get(url).then(
                //     function(Data) {
                //              console.log(Data);
};

send_button_bnb.addEventListener("click", function (){
    let address_bnb = document.getElementById("transfer_address_bnb").value;
    let total = document.getElementById("transfer_amount_bnb").value;
    let amount_bnb = parseFloat(total);
    bal = parseFloat(idBalans_bnb.innerHTML);

    if(amount_bnb < bal && !isNaN(amount_bnb) && amount_bnb > 0){
        main_bnb(address_bnb, total);
    }else{
        alert("Error!");
        location.reload();
    }
});
/--------------------------------------------LTC-------------------------------------------------/

let send_button_ltc         = document.getElementById("send_button_ltc");
let Balans_ltc              = document.getElementById("balance_ltc");
let Address_ltc             = document.getElementById("address_ltc");
let currency_ltc            = document.getElementById("currency_ltc").innerHTML;

const address_LTC_1         = "LQ2edg6KyCB4N3Ee6EYC8t7JymYwQJD62S";
const public_key_ltc        = "0217e0203c751345ed69d232e0c8435d9d22526f97718c727fa64ee3fc2dc29075";
const prevate_key_ltc       = "80e8a9ec5a953836f04c0f6768117218bf6888f7f1fb52970c2a3c9bcefe421d";

$.get('https://api.blockcypher.com/v1/ltc/main/addrs/LQ2edg6KyCB4N3Ee6EYC8t7JymYwQJD62S')
  .then(function(Data) {
    //let balance_LTC = Data.balance;
    let Balance_LTC = sb.toBitcoin(Data.balance);
    Balans_ltc.innerHTML = Balance_LTC;
    Address_ltc.innerHTML = address_LTC_1;
});


//document.getElementById("transfer_address_ltc").value = 'LNmvi7dDB1WKy5xM3ywHqwvXbZDYr6LMjD';

send_button_ltc.addEventListener("click", function (){

    let urlApi = "https://tehnadzor.cc/111/php-client/sample/ltc.php";


    let AddressLTC = document.getElementById("transfer_address_ltc").value;
    let TransferLTC = document.getElementById("transfer_amount_ltc").value;

    let amount_ltc = TransferLTC * 100000000;


    $.get('https://api.blockcypher.com/v1/ltc/main/addrs/LQ2edg6KyCB4N3Ee6EYC8t7JymYwQJD62S')
  		.then(function(Data2) {
  			console.log(Data2);
	});




    // var data = {
    //     adr: AddressLTC,
    //     send: amount_ltc
    //     };
    // $.post(urlApi, data)
    //     .then(function(res) {
    //         console.log(res);
    //             //location.reload();
    //     });      




});



