// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./interfaces/ERC721Interface.sol";
import "./ERC165.sol";

contract ERC721 is ERC721Interface,ERC165 {
    mapping(uint256 =>address) private _tokenOwners;
    mapping(address =>uint256) private _TokenOwnerOwened; //how many this address has token

    constructor(){
         _registerInterface(bytes4(keccak256('balanceOf(bytes4)')^
         keccak256('ownerOf(bytes4)')
         ));


    }

    //know how many token user has
    function balanceOf(address _owner) external view override returns(uint256){
        require(_owner !=address(0),"this address not avilable");
        return _TokenOwnerOwened[_owner];
    }

    //who owned token
    function ownerOf(uint256 _tokenId ) external view override returns(address){
        address  _owner = _tokenOwners[_tokenId];
        require(_owner !=address(0),"this address not avilable");
        return _owner;
    }


    event Transfare(address indexed from ,address  indexed to ,uint256 indexed tokenId);
    function _exists(uint256 tokenId) internal view returns(bool){
        address owner = _tokenOwners[tokenId];
        return owner!=address(0);
    }

    // send the token to the owner
    function _mint(address to, uint256 tokenId) internal virtual{
        require(to!=address(0),"can not mint to address zero");
        require(!_exists(tokenId),"token already minted");
        _tokenOwners[tokenId]= to;
        _TokenOwnerOwened[to] += 1;
        emit Transfer(address(0),to,tokenId);


    }





}