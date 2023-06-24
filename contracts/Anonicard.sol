// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract AnoniCard is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct TokenMetadata {
        string cardInfo;
        string cardInfoDecryption;
        string customFields;
        string customFieldsDecryption;
    }

    mapping(uint256 => TokenMetadata) private _tokenMetadata;

    constructor() ERC721("AnoniCard", "ANONICARD") {}

    function mint(
        string memory cardInfo,
        string memory cardInfoDecryption,
        string memory customFields,
        string memory customFieldsDecryption
    ) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);

        _tokenMetadata[newItemId] = TokenMetadata(
            cardInfo,
            cardInfoDecryption,
            customFields,
            customFieldsDecryption
        );

        return newItemId;
    }

    function updateCustomFields(uint256 tokenId, string memory newCustomFields) public {
        require(ownerOf(tokenId) == msg.sender, "ERC721: caller is not the owner");

        _tokenMetadata[tokenId].customFields = newCustomFields;
    }

    function updateCustomFieldsDecryption(uint256 tokenId, string memory newCustomFieldsDecryption) public {
        require(ownerOf(tokenId) == msg.sender, "ERC721: caller is not the owner");

        _tokenMetadata[tokenId].customFieldsDecryption = newCustomFieldsDecryption;
    }

    function getCardInfo(uint256 tokenId) public view returns (string memory) {
        return _tokenMetadata[tokenId].cardInfo;
    }

    function getCardInfoDecryption(uint256 tokenId) public view returns (string memory) {
        return _tokenMetadata[tokenId].cardInfoDecryption;
    }

    function getCustomFields(uint256 tokenId) public view returns (string memory) {
        return _tokenMetadata[tokenId].customFields;
    }

    function getCustomFieldsDecryption(uint256 tokenId) public view returns (string memory) {
        return _tokenMetadata[tokenId].customFieldsDecryption;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }
}