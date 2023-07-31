import { ethers } from 'hardhat'
import ERC721Token from '../deployments/cronos_testnet/ERC721Token.json';


const provider = new ethers.providers.JsonRpcProvider(
    "https://evm-t3.cronos.org/"
);
const secretkey = process.env.DEPLOYER_PRIVATE_KEY;
const walletObj = new ethers.Wallet(secretkey!);
const ethersSigner = walletObj.connect(provider);

async function main() {
    const receiver = "0xc75C8C7f741a312Ba9f5E6725cf837EcB379054D";
    const ERC721Contract = new ethers.Contract(ERC721Token.address, ERC721Token.abi, ethersSigner);
    const mintTx = await ERC721Contract.mintNFT(receiver, " ", 0);

    const mintRc = await mintTx.wait();
    const mintEvent = mintRc.events.find((element: any) => element.event === 'MintNFT');
    const [tokenId, accountAddr] = mintEvent.args;
    console.log("token ID: ", tokenId);
    console.log("Account Address: ", accountAddr);
    //console.log(mintRc);
    const addr = await ERC721Contract.getAccountAddress(tokenId, 0);

    console.log("address check: ", addr);

    /* const TokenId = await ERC721Contract.supply();
    console.log("Minted id: ", TokenId);
    console.log("Receiver: ", receiver);*/
} 

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
  