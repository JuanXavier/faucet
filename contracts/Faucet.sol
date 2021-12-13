// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Owned.sol"; 
import "./Logger.sol";
import "./IFaucet.sol";
 
/*-----------------------------------------------------------------------------------------------*/

contract Faucet is Owned, Logger, IFaucet {
    uint256 public numOfFunders;

    mapping(address => bool) private funders;
    mapping(uint256 => address) private lutFunders; // lookup table founders

    // special function for receiving ether. Called when tx that doesnt specify function name
    receive() external payable {}

    /*-------------------------------------------------------------------------------------------*/

    function addFunds() external override payable {
        address funder = msg.sender;
        
        if (!funders[funder]) {             // if the new funder(msg.sender) is not in the mapping, 
            uint256 index = numOfFunders++; // then increment number of funders
            funders[funder] = true;         // make it true
            lutFunders[index] = funder;     // and add the sender                 
        } 
    }

    /*-------------------------------------------------------------------------------------------*/

    function withdraw(uint256 amount) override external payable limitWithdraw(amount) {
        payable(msg.sender).transfer(amount);
    }

    /*-------------------------------------------------------------------------------------------*/

    modifier limitWithdraw(uint256 amount) {
        require (amount <= 0.01 ether, "You can not withdraw more than 0.1 Ether." );
        _;
    }

    /*-------------------------------------------------------------------------------------------*/

    function emitLog() public virtual pure override returns(bytes32) {
        return "Inherited from logger";
    }

    /*-------------------------------------------------------------------------------------------*/

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    /*-------------------------------------------------------------------------------------------*/

    function getAllFunders() external view returns (address[] memory) {
        // New array with same amount of items as numOfFunders
        address[] memory _funders = new address[](numOfFunders); 

        for (uint256 i=0; i < numOfFunders; i++) { 
            _funders[i] = lutFunders[i]; 
        }
        return _funders;
    }

    /*-------------------------------------------------------------------------------------------*/

    function getFunderAtIndex(uint8 index) public view returns(address) {
        return lutFunders[index];
    }
}