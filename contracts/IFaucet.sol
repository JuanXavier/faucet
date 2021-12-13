// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

//they cant inherit from other smart contracts
//can only inherit from other interfaces
//cant declare constructor
//cant declare state variables
//functions must be external

interface IFaucet {
		function addFunds() payable external;
		
		function withdraw(uint256 withdrawAmount) payable external;
}