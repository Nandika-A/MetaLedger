// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ownable.sol";

contract Category is Ownable {

    // structure to store transaction details
    struct Transaction {
        address sender;
        address receiver;
        uint amount;
        uint timestamp;
    }

    // category mapping
    mapping(string => Transaction[]) transactionCategories;

    // Record Transaction Function
    function recordTransaction(address _sender, address _receiver, uint _amount, uint _timestamp, string memory _category) public onlyOwner {
        Transaction memory newTransaction = Transaction(_sender, _receiver, _amount, _timestamp);
        transactionCategories[_category].push(newTransaction);
    }

    // Get transactions
    function getTransactionsByCategory(string memory _category) public view returns (Transaction[] memory) {
        return transactionCategories[_category];
    }

}