// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interfaces/IERC6551Registry.sol";

interface erc721Router {
    function getAccountAddress(uint256 id, uint256 seed) external view returns (address);
}



contract ERC1155Token is ERC1155, Ownable {

    mapping(address => mapping(uint256 => bool)) public isMinted;
    address private _erc721Addr;

    constructor(address erc721, string memory tokenURI) ERC1155(tokenURI) {
        _erc721Addr = erc721;
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(address account, uint256 id, bytes memory data)
        public
        onlyOwner
    {
        require(!isMinted[account][id], "1 token to each id");
        _mint(account, id, 1, data);
        isMinted[account][id] = true;
    }

    /* function mintBatch(address to, uint256[] memory ids, bytes memory data)
        public
        onlyOwner
    {

        _mintBatch(to, ids, 1, data);
    } */

    function uri(uint256 _tokenid) override public view returns (string memory) {
        return string(
            abi.encodePacked(
                super.uri(_tokenid),
                Strings.toString(_tokenid),".json"
            )
        );
    }

    function getTokens(uint256 id, uint256 seed) public view returns(uint256[] memory tokenIds) {
        uint256 numOfIds = 5;
        address accountAddr = erc721Router(_erc721Addr).getAccountAddress(id, seed);
        uint256 size = 0;

        for(uint256 i = 1; i <= numOfIds; i++) {
            uint256 bal = balanceOf(accountAddr, i);
            if(bal > 0) {
                size++;
            }
        }

        tokenIds = new uint256[](size);

        uint256 idx = 0;
        for(uint256 i = 1; i <= numOfIds; i++) {
            uint256 bal = balanceOf(accountAddr, i);
            if(bal > 0) {
                tokenIds[idx] = i;
                idx++;
            }
        }
    }



}
