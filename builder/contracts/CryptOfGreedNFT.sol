// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CryptOfGreedNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    
    // Mapping from tokenId to tier
    mapping(uint256 => string) private _tokenTiers;
    
    // Mapping from tokenId to invested status
    mapping(uint256 => bool) private _tokenInvested;
    
    // Equipment types
    enum EquipmentSlot { WEAPON, ARMOR, ACCESSORY }
    
    // Equipment metadata
    struct Equipment {
        string tier;
        EquipmentSlot slot;
        bool isStarter; // T0 equipment flag
    }
    
    // Mapping from tokenId to equipment data
    mapping(uint256 => Equipment) private _equipmentData;

    // Events
    event GameItemMinted(address indexed player, uint256 tokenId, string tier, EquipmentSlot slot);
    event TokenInvested(uint256 indexed tokenId);
    event TokenBurned(uint256 indexed tokenId);

    constructor() ERC721("CryptOfGreedNFT", "CRYPT") Ownable(msg.sender) {}

    function mintGameItem(
        address player, 
        string memory uri, 
        string memory tier,
        EquipmentSlot slot,
        bool isStarter
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(player, tokenId);
        _setTokenURI(tokenId, uri);
        _tokenTiers[tokenId] = tier;
        _tokenInvested[tokenId] = false;
        _equipmentData[tokenId] = Equipment(tier, slot, isStarter);
        
        emit GameItemMinted(player, tokenId, tier, slot);
        return tokenId;
    }

    // Special function for minting T0 (starter) equipment
    function mintStarterEquipment(
        address player,
        string memory uri,
        EquipmentSlot slot
    ) public onlyOwner returns (uint256) {
        return mintGameItem(player, uri, "T0", slot, true);
    }

    function investToken(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(!_tokenInvested[tokenId], "Token already invested");
        require(!_equipmentData[tokenId].isStarter, "Starter equipment cannot be invested");
        _tokenInvested[tokenId] = true;
        emit TokenInvested(tokenId);
    }

    function burnToken(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(_tokenInvested[tokenId], "Token not invested");
        require(!_equipmentData[tokenId].isStarter, "Starter equipment cannot be burned");
        emit TokenBurned(tokenId);
        _burn(tokenId);
    }

    function getTokenTier(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenTiers[tokenId];
    }

    function isTokenInvested(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenInvested[tokenId];
    }

    function getEquipmentData(uint256 tokenId) public view returns (Equipment memory) {
        require(_exists(tokenId), "Token does not exist");
        return _equipmentData[tokenId];
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
