// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Owned.sol"; 
import "./Logger.sol";
import "./IFaucet.sol";
 
contract Faucet is Owned, Logger, IFaucet {
    uint256 public numOfFunders;

    mapping(address => bool) private isFunder;
    mapping(uint256 => address) private funders; 

    receive() external payable {}

    modifier limitWithdraw(uint256 amount) {
        require (amount <= 0.01 ether, "You can not withdraw more than 0.01 Ether daily." );
        _;
    }

    function addFunds() external override payable {
        if (!isFunder[msg.sender]) {             
            isFunder[msg.sender] = true;         
            funders[numOfFunders++] = msg.sender;          
        }
    }

    function withdraw(uint256 amount) override external payable limitWithdraw(amount) returns(bool) {
        (bool success, ) = payable(msg.sender).call{value: amount} ("");
        return success; 
    }

    function emitLog() public virtual pure override returns(bytes32) {
        return "Inherited from logger";
    }

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders); 

        for (uint256 i=0; i < numOfFunders; i++) { 
            _funders[i] = funders[i]; 
        }
        return _funders;
    }

    function getFunderAtIndex(uint8 index) public view returns(address) {
        return funders[index];
    }
}