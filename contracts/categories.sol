// SPDX-License-Identifier: MIT
pragma solidity >= 0.6.0 < 0.9.0;

contract Catagory {

    // structure to store transaction details
    struct Transaction {
        address sender;
        address receiver;
        uint amount;
        uint timestamp;
    }

    // catagory mapping
    mapping(bytes32 => Transaction[]) transactionCategories;

    // Record Transaction Function
    function recordTransaction(address _sender, address _receiver, uint _amount, uint _timestamp, bytes32 _category) public {
        Transaction memory newTransaction = Transaction(_sender, _receiver, _amount, _timestamp);
        transactionCategories[_category].push(newTransaction);
    }

    // Get transactions
    function getTransactionsByCategory(bytes32 _category) public view returns (Transaction[] memory) {
        return transactionCategories[_category];
    }
}