// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IERC6551Registry.sol";
import "./interfaces/IERC6551Account.sol";

contract ERC721Token is ERC721URIStorage, Ownable{
    event MintNFT(uint256 tokenID, address accountAddr);
    
    uint256 private _tokenIds;
    address private _registry;
    address private _account; 
    
    mapping(uint256 => bool) public isActive;

    constructor(string memory name, string memory symbol, address registry, address account) ERC721(name, symbol){
        _tokenIds = 0;
        _registry = registry;
        _account = account;
    }

    function mintNFT(address recipient, string memory tokenURI, uint256 seed)
        public
        returns (uint256)
    {
        _tokenIds++;

        uint256 newItemId = _tokenIds;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        address accountAddr = IERC6551Registry(_registry).createAccount(
            _account,
            338,
            address(this),
            newItemId,
            seed,
            ""
        );
        isActive[newItemId] = true;

        emit MintNFT(newItemId, accountAddr);



        return newItemId;
    }


    function burnNFT(uint256 _id) external {
        _burn(_id);
    }

    function supply() public view returns (uint256){
        return _tokenIds;
    }

    function getAccountAddress(uint256 id, uint256 seed) public view returns (address) {
        address accountAddr = IERC6551Registry(_registry).account(
            _account,
            338,
            address(this),
            id,
            seed
        );

        return accountAddr;
    }

    function setActive(uint256 id, bool status) public{
        isActive[id] = status;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId, /* firstTokenId */
        uint256 batchSize
    ) internal override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);

        // NFT가 이미 존재하는 경우, 특정 계정에서 다른 계정으로 이동하는 것을 방지
        require(from == address(0) || to == address(0) || !isActive[tokenId], "Transfer not allowed");
    }

    function getActiveNFT() public view returns(uint256[] memory ids, string[] memory uris, address[] memory owners){
        uint256 activeCnt = 0;
        for(uint256 i = 1; i <= _tokenIds; i++) {
            if(isActive[i]) {
                activeCnt++;
            }
        }
        ids = new uint256[](activeCnt);
        uris = new string[](activeCnt);
        owners = new address[](activeCnt);
        uint256 idx = 0;
        for(uint256 i = 1; i <= _tokenIds; i++) {
            if(isActive[i]) {
                string memory uri = tokenURI(i);

                ids[idx] = i;
                uris[idx] = uri;
                owners[idx] = ownerOf(i);
                idx++;
            }
        }
    }
}