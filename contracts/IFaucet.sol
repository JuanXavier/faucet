// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

interface IFaucet {
		function addFunds() payable external;
		
		function withdraw(uint256 withdrawAmount) payable external returns(bool);
}