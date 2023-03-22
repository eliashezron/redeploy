// SPDX-License-Identifier: MIT

pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
<<<<<<< HEAD
    constructor() ERC20("Dapp Token", "DAPP") {
=======
    constructor() public ERC20("Dapp Token", "DAPP") {
>>>>>>> origin/main
        _mint(msg.sender, 1000000000000000000000000);
    }
}
