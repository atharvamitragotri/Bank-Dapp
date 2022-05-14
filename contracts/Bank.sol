// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Bank is Ownable{
    bytes32[] public allowedSymbols;
    mapping(bytes32 => address) public allowedTokens; // to store address of the allowed tokens
    mapping(address => mapping(bytes32 => uint256)) public balances; //to store the balances for the allowed tokens

    function selectTokens(bytes32 _symbol, address _address) external onlyOwner{
        allowedSymbols.push(_symbol);
        allowedTokens[_symbol] = _address;
    }

    function getAllowedSymbols() external view returns (bytes32[] memory){
        return allowedSymbols;
    }

    function getAllowedTokensAddress(bytes32 _symbol) external view returns (address){
        return allowedTokens[_symbol];
    }

    receive() external payable{
        balances[msg.sender]['eth'] += msg.value;
    }

    function withdrawEther(uint256 _amount) external {
        require(balances[msg.sender]['eth'] >= _amount,"Insufficient funds!");
        balances[msg.sender]['eth'] -= _amount;
        (bool success,) = payable(msg.sender).call{value: _amount}("");
        require(success, "Receiver rejected the transfer");
    }

    function depositTokens(uint256 _amount, bytes32 _symbol) external {
        balances[msg.sender][_symbol] += _amount; 
        IERC20(allowedTokens[_symbol]).transferFrom(msg.sender, address(this), _amount);
    }

    function withdrawTokens(uint256 _amount, bytes32 _symbol) external {
        require(balances[msg.sender]['eth'] >= _amount,"Insufficient funds!");
        balances[msg.sender][_symbol] -= _amount;
        IERC20(allowedTokens[_symbol]).transfer(msg.sender, _amount);
    }

    function getTokenBalance(bytes32 _symbol) external view returns (uint256 _amount){
        _amount = balances[msg.sender][_symbol];
    }

}