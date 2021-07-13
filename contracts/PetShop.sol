// SPDX-License-Identifier: NO-LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PetShop is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    using Strings for uint256;
    
    mapping(uint256=>bool) private _isPetOnSale;
    
    // mapping the TokenId to price
    mapping(uint256 => uint256) private petsPrice;

    //  mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    event PetTransfer(
        uint256 indexed tokenId,
        address oldOwner,
        address newOwner,
        uint256 price,
        uint256 date
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

    function isPetOnSale(uint256 _tokenId) view public returns(bool){
        return _isPetOnSale[_tokenId];
    }

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

    function mintPetNft(string memory _tokenURI)
        external
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _isPetOnSale[newItemId] = false;
        _setTokenURI(newItemId, _tokenURI);
        emit PetTransfer(newItemId,address(0),msg.sender, 0,block.timestamp);
        return newItemId;
    }

    function putPetOnSale(uint256 _tokenId,uint256 _price)
        external
        onlyTokenOwner(_tokenId)
        returns (bool)
    {
        require(
            _tokenId > 0 && _exists(_tokenId),
            "PetShop: tokenId not valid"
        );
        petsPrice[_tokenId] = _price;
        _isPetOnSale[_tokenId] = true;
        return true;
    }

    function buyPetNft(uint256 _tokenId) public payable returns (bool) {
        require(
            _tokenId > 0 && _exists(_tokenId),
            "PetShop: tokenId not valid"
        );
        require(_isPetOnSale[_tokenId],"pet not for sale");
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
        emit PetTransfer( _tokenId,msg.sender,ownerAddress, msg.value,block.timestamp);
        _isPetOnSale[_tokenId] = false;
        return true;
    }
}
