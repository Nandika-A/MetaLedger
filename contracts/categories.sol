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
    Transaction[] public transactions;
    // category mapping
    mapping(uint => string) transactionToCategory;
    mapping(string => uint) transactionsPerCategory;

    // Record Transaction Function
    function recordTransaction(address _sender, address _receiver, uint _amount, uint _timestamp, string memory _category) public onlyOwner {
        transactions.push(Transaction(_sender, _receiver, _amount, _timestamp));
        uint id = transactions.length - 1;
        transactionToCategory[id] = _category;
        transactionsPerCategory[_category]++;
    }

    // Get transactions
    function getTransactionsByCategory(string memory _category) public view onlyOwner returns (uint[] memory) {
        uint[] memory result = new uint[](transactionsPerCategory[_category]);
        uint counter = 0;
        for(uint i = 0; i < transactions.length; i++)
        {
            if(keccak256(abi.encodePacked(transactionToCategory[i])) == keccak256(abi.encodePacked(_category)))
            {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

}