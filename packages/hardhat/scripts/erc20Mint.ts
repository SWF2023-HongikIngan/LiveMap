import { ethers } from 'hardhat'
import ERC20Token from '../deployments/cronos_testnet/ERC20Token.json';


const provider = new ethers.providers.JsonRpcProvider(
    "https://evm-t3.cronos.org/"
);
const secretkey = process.env.DEPLOYER_PRIVATE_KEY;
const walletObj = new ethers.Wallet(secretkey!);
const ethersSigner = walletObj.connect(provider);

async function main() {
    const ERC20Contract = new ethers.Contract(ERC20Token.address, ERC20Token.abi, ethersSigner);
    const mintTx = await ERC20Contract.mint("0xc75C8C7f741a312Ba9f5E6725cf837EcB379054D");

    const mintRc = await mintTx.wait();
    console.log(mintRc);
}

main().catch(error => {
    console.error(error);
    process.exitCode = 1;
  });
  