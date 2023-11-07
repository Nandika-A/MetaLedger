// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ownable.sol";

contract Category is Ownable {

    event NewTransaction(uint id);

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
    mapping(uint => address) transactionToUser;

    uint totalTransactions;

    address user;

    function setUser(address _user) external {
        user = _user;
    }

    modifier onlyUser() {
        require(user == msg.sender);
        _;
    }

    // Record Transaction Function
    function recordTransaction(address _user, address _sender, address _receiver, uint _amount, string memory _category) public onlyOwner{
        transactions.push(Transaction(_sender, _receiver, _amount, block.timestamp));
        uint id = transactions.length - 1;
        transactionToCategory[id] = _category;
        transactionsPerCategory[_category]++;
        totalTransactions++;
        transactionToUser[id] = _user;
        emit NewTransaction(id);
    }

    // Get transactions
    function getTransactionsByCategory(address _user, string memory _category) public view onlyUser returns (uint[] memory) {
        uint[] memory result = new uint[](transactionsPerCategory[_category]);
        uint counter = 0;
        for(uint i = 0; i < transactions.length; i++)
        {
            if(transactionToUser[i] == _user && keccak256(abi.encodePacked(transactionToCategory[i])) == keccak256(abi.encodePacked(_category)))
            {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    function getTransactionsByTime(address _user, uint _timeperiod) public view onlyUser returns(uint[] memory) {
        uint[] memory result = new uint[](totalTransactions);
        uint counter = 0;
        for(uint i = 0; i < transactions.length; i++)
        {
            if(transactionToUser[i] == _user && transactions[i].timestamp >= (block.timestamp - _timeperiod))
            {
                result[counter] = i;
                counter ++;
            }
        }
        return result;
    } 

    function getTotalExpenses(address _user, uint _timeperiod) public view onlyUser returns(
        uint earnings,
        uint expenditure,
        uint savings
    ) {
        uint t_earnings = 0;
        uint t_savings = 0;
        uint t_expenditure = 0;

        for(uint i = 0; i < transactions.length; i++)
        {
            if(transactions[i].timestamp >= (block.timestamp - _timeperiod)){
                if(transactions[i].sender == _user)
                    t_expenditure += transactions[i].amount;

                else if(transactions[i].receiver == _user)
                    t_earnings += transactions[i].amount;
            }
        }
        t_savings = t_earnings - t_expenditure;
        
        return (t_earnings, t_expenditure, t_savings);
    }

}