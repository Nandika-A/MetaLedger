import { ethers } from "./ethers-5.1.esm.min.js"
import { abi, contractAddress } from "./constants.js"

let currentAccount = null;
const day = 86400;
const week = 604800;
const month = 2628000;
const year = 31560000;

const ethereumButton = document.querySelector('.enableEthereumButton');
const showAccount = document.querySelector('.showAccount');
const record = document.querySelector('.record');
const getCategory = document.querySelector('.category');
const getTime = document.querySelector('.time');

ethereumButton.addEventListener('click', () => {
  getAccount();
});

async function getAccount() {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    .catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
      }
    });
  const account = accounts[0];
  showAccount.innerHTML = account;
  currentAccount = account;
}

window.ethereum.request({ method: 'eth_accounts' })
  .then(handleAccountsChanged)
  .catch((err) => {
    // Some unexpected error.
    // For backwards compatibility reasons, if no accounts are available,
    // eth_accounts returns an empty array.
    console.error(err);
  });

// Note that this event is emitted on page load.
// If the array of accounts is non-empty, you're already
// connected.


window.ethereum.on('accountsChanged', handleAccountsChanged);

// eth_accounts always returns an array.
function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    // MetaMask is locked or the user has not connected any accounts.
    console.log('Please connect to MetaMask.');
    currentAccount = null;
  } else if (accounts[0] !== currentAccount) {
    // Reload your interface with accounts[0].
    currentAccount = accounts[0];
    // Update the account displayed (see the HTML for the connect button)
    showAccount.innerHTML = currentAccount;
  }
}

const chainId = await window.ethereum.request({ method: 'eth_chainId' });

window.ethereum.on('chainChanged', handleChainChanged);

function handleChainChanged(chainId) {
  // We recommend reloading the page, unless you must do otherwise.
  window.location.reload();
}

// *****************************************************
// Accessing contract

record.addEventListener('click', () => {
  recordTransaction();
});

async function recordTransaction() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.recordTransaction(
        "0xe2ba10c388ef4a013db4ff13f56b742893208d05",
        "0xe2ba10c388ef4a013db4ff13f56b742893208d05",
        "0xe2ba10c388ef4a013db4ff13f56b742893208d05",
        "125",
        "food")
      await listenForTransactionMine(transactionResponse, provider)
      console.log(transactionResponse)
    } 
    catch (error) {
      console.log(error)
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask"
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`)
  return new Promise((resolve, reject) => {
      try {
          provider.once(transactionResponse.hash, (transactionReceipt) => {
              console.log(
                  `Completed with ${transactionReceipt.confirmations} confirmations. `
              )
              resolve()
          })
      } catch (error) {
          reject(error)
      }
  })
}

getCategory.addEventListener('click', () => {
  getTransactionsByCategory();
});


async function getTransactionsByCategory() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.getTransactionsByCategory(
        "0xe2ba10c388ef4a013db4ff13f56b742893208d05",
        "food")
        console.log(transactionResponse)
      getCategory.innerHTML = transactionResponse;
    } 
    catch (error) {
      console.log(error)
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask"
  }
}

getTime.addEventListener('click', () => {
  getTransactionsByTime();
});


async function getTransactionsByTime() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.getTransactionsByTime(
        "0xe2ba10c388ef4a013db4ff13f56b742893208d05",
        1)
        console.log(transactionResponse)
      const expenses = await contract.getTotalExpenses(
        "0xe2ba10c388ef4a013db4ff13f56b742893208d05",
        1
      )
      console.log(expenses)
    } 
    catch (error) {
      console.log(error)
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask"
  }
}

