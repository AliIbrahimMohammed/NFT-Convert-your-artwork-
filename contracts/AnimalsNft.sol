// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./ERC721Metadata.sol";
import "./ERC721.sol";
import "./ERC721Enumerable.sol";

contract AnimalsNft is ERC721Metadata,ERC721Enumerable{
    constructor() ERC721Metadata("AnimalsNFT2","ANI2"){
        _registerInterface(bytes4(keccak256('mint(bytes4)')
         ));

    }
    string [] public animalsNft;
    mapping(string=>bool) _animalUrlExists;

    function mint(string memory _animalUrl) public {
        require(!_animalUrlExists[_animalUrl],"this NFT URL token Already Exists");
        animalsNft.push(_animalUrl);
        uint _id = animalsNft.length -1;
        _animalUrlExists[_animalUrl] = true;
        _mint(msg.sender, _id);

    }










}

    