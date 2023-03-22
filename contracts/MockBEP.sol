// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor() ERC20("Dapp Token", "DAPP") {
        _mint(msg.sender, 1000000000000000000000000);
    }
}
