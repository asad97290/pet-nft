// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PetShop is ERC721Enumerable, Ownable {
    
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    using Strings for uint256;
    
    // mapping the TokenId and price
    mapping(uint256 => uint256) public petsForSale;

    // Optional mapping for token URIs
    mapping (uint256 => string) private _tokenURIs;

    constructor() ERC721("PetShopNFT", "PNFT") {}

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return super.tokenURI(tokenId);
    }

    /**
     * @dev Sets `_tokenURI` as the tokenURI of `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721URIStorage: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function mintPetNft(string memory _tokenURI,uint256 _price)
        external
        onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        
        // _beforeTokenTransfer(address(0),owner(),newItemId);
        _mint(owner(), newItemId);
        petsForSale[newItemId] = _price;
        _setTokenURI(newItemId, _tokenURI);

        return newItemId;
    }

    function buyPetNft(uint256 _tokenId) public payable {
    
        uint256 petCost = petsForSale[_tokenId];
        address ownerAddress = ownerOf(_tokenId);
        require(msg.value >= petCost, "You need to have enough Ether");
        // _beforeTokenTransfer(ownerAddress,msg.sender,_tokenId);
        _safeTransfer(ownerAddress, msg.sender, _tokenId, "");
         payable(ownerAddress).transfer(petCost);
        if (msg.value > petCost) {
            payable(msg.sender).transfer(msg.value - petCost);
        }
    }
}
