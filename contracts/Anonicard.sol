// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract AnoniCard is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("AnoniCard", "ANONICARD") {}

    function mint(
        address receiver,
        string memory tokenURI
    ) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(receiver, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function updateMetadata(uint256 tokenId, string memory newTokenURI) public {
        require(ownerOf(tokenId) == msg.sender, "ERC721: caller is not the owner");

        _setTokenURI(tokenId, newTokenURI);
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
}