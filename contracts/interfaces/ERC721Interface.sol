// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

interface ERC721Interface  {

event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);


function balanceOf(address _owner) external  view returns (uint256);

            
function ownerOf(uint256 _tokenId) external  view returns (address);












    
}