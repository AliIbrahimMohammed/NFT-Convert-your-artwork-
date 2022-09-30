// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./ERC721.sol";
import "./interfaces/IERC721Enumerable.sol";


contract ERC721Enumerable is ERC721, IERC721Enumerable{
    //TODO the other interface function 
            uint256 [] private _allTokens;

            constructor(){
                _registerInterface(bytes4(keccak256('totalSupply(bytes4)')^
                keccak256('tokenByIndex(bytes4)')^
                keccak256('tokenOfOwnerByIndex(bytes4)')
                
                ));
            }

             function totalSupply() public override view returns(uint256) {
                return _allTokens.length;
            }

            function tokenByIndex(uint256 index) public override view returns(uint256){
                require(index < totalSupply(),"your index invaild");
                return _allTokens[index];
            }
        
            function _mint(address to, uint256 tokenId) internal override(ERC721) {
                super._mint(to,tokenId);
                _addtokenToAll(tokenId);

            }


            

            mapping(address=>uint256[]) private _owenedTokens;
            mapping(uint256=>uint256) private _allTokensByIndex;
            mapping(uint256=>uint256) private _owendTokenIndex;

            function _addtokenToAll(uint256 tokenId) private {
                _allTokensByIndex[tokenId] = _allTokens.length;
                _allTokens.push(tokenId);
            }
            function tokenOfOwnerByIndex(address owner, uint256 index) public override view returns(uint256){
                return _owenedTokens[owner][index];
            }

            function _addTokensToTheOwners(address to, uint256 tokenId) private {
                _owendTokenIndex[tokenId] = _owenedTokens[to].length;
                _owenedTokens[to].push(tokenId);
            }
            






}           