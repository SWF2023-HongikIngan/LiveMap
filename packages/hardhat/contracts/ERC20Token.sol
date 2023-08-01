// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract ERC20Token is ERC20, ERC20Burnable {
    constructor() ERC20("TRUE", "TRUE") {
    }

    function mint(address receiver, uint256 value) {
        require(balanceOf(receiver) == 0, "you can only mint 1 token to each address");
        _mint(receiver, value);
    }

}