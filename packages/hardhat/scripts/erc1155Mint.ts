import { ethers } from 'hardhat'
//import ERC1155Token from '../deployments/cronos_testnet/ERC1155Token.json';
import ERC1155Token from '../deployments/localhost/ERC1155Token.json';


/* const provider = new ethers.providers.JsonRpcProvider(
    "https://evm-t3.cronos.org/"
); */

const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
);
//const secretkey = process.env.DEPLOYER_PRIVATE_KEY;
const secretkey = process.env.LOCAL_PRIVATE_KEY;
const walletObj = new ethers.Wallet(secretkey!);
const ethersSigner = walletObj.connect(provider);

async function main() {
    const ERC1155Contract = new ethers.Contract(ERC1155Token.address, ERC1155Token.abi, ethersSigner);
    const mintTx = await ERC1155Contract.mint("0x2b2940d4888effa1918C85D10F0740A90c447aa7", 2, []);

    const mintRc = await mintTx.wait();
    console.log(mintRc);

    const tokens = await ERC1155Contract.getTokens(1, 0);
    console.log(tokens);
    const uri = await ERC1155Contract.uri(1);
    console.log(uri);


}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
  