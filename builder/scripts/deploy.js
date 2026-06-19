const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contract with the account:", deployer.address);

  const CryptOfGreedNFT = await ethers.getContractFactory("CryptOfGreedNFT");
  const cryptOfGreedNFT = await CryptOfGreedNFT.deploy();

  console.log("Contract address:", await cryptOfGreedNFT.getAddress());

  // Verify the contract on the Core DAO explorer (optional)
  if (process.env.CORE_EXPLORER_API_KEY) {
    await hre.run("verify:verify", {
      address: await cryptOfGreedNFT.getAddress(),
      constructorArguments: [],
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
