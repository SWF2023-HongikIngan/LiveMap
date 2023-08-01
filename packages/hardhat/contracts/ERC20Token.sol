// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract ERC20Token is ERC20, ERC20Burnable {

    mapping(address => mapping(address => bool)) public isMinted; //  from - to


    constructor() ERC20("TRUE", "TRUE") {
    }

    function mint(address receiver) public {
        require(!isMinted[msg.sender][receiver], "You can mint only 1 token to each account");
        _mint(receiver, 1);
    }

}