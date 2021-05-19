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
    mapping(uint256 => uint256) public petsPrice;

    // Boolean values either pets are on sale or not
    mapping(uint256 => bool) public petsOnSale;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    event PetCreated(
        address indexed owner,
        uint256 tokenId,
        uint256 price,
        string tokenURI
    );

    event PetPurchase(
        address indexed prevOwner,
        address indexed newOwner,
        uint256 tokenId,
        uint256 price
    );

    modifier onlyTokenOwner(uint256 tokenId) {
        require(
            ownerOf(tokenId) == msg.sender,
            "PetShop: caller is not the token owner"
        );
        _;
    }

    constructor() ERC721("PetShopNFT", "PNFT") {}

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI query for nonexistent token"
        );

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
    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
    {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }

    function mintPetNft(string memory _tokenURI, uint256 _price)
        external
        onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(owner(), newItemId);
        petsPrice[newItemId] = _price;
        petsOnSale[newItemId] = false;
        _setTokenURI(newItemId, _tokenURI);
        emit PetCreated(owner(), newItemId, _price, _tokenURI);
        return newItemId;
    }

    function putPetOnSale(uint256 _tokenId)
        external
        onlyTokenOwner(_tokenId)
        returns (bool)
    {
        require(
            _tokenId > 0 && _exists(_tokenId),
            "PetShop: tokenId not valid"
        );
        petsOnSale[_tokenId] = true;
        return true;
    }

    function buyPetNft(uint256 _tokenId) public payable returns (bool) {
        require(
            _tokenId > 0 && _exists(_tokenId),
            "PetShop: tokenId not valid"
        );
        address ownerAddress = ownerOf(_tokenId);
        require(
            msg.sender != ownerAddress && msg.sender != owner(),
            "PetShop: contract owner can't buy or you already bought this pet"
        );
        uint256 petCost = petsPrice[_tokenId];
        require(msg.value >= petCost, "PetShop: You need to have enough Ether");
        _safeTransfer(ownerAddress, msg.sender, _tokenId, "");
        payable(ownerAddress).transfer(petCost);
        if (msg.value > petCost) {
            payable(msg.sender).transfer(msg.value - petCost);
        }
        emit PetPurchase(ownerAddress, msg.sender, _tokenId, msg.value);
        return true;
    }
}
