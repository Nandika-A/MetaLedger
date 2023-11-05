// imports
const { ethers, run, network } = require("hardhat")

// async main
async function main() {
  const storageFactory = await ethers.getContractFactory("Category")
  console.log("Deploying contract...")
  const category = await storageFactory.deploy()
  console.log(`Deployed contract to: ${category.target}`)

  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...")
    await category.deploymentTransaction().wait(6)
    await verify(category.target, [])
  }
}

// async function verify(contractAddress, args) {
const verify = async (contractAddress, args) => {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e)
    }
  }
}

// main
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
