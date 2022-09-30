// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./interfaces/IERC165.sol";

contract ERC165 is IERC165{

    mapping(bytes4=>bool) private _supportedeInterfaces;

    constructor(){
        _registerInterface(bytes4(keccak256('supportsInterface(bytes4)')));
    }

    function supportsInterface(bytes4 interfaceID) external override view returns(bool){

        return _supportedeInterfaces[interfaceID];
    }

    function _registerInterface(bytes4 interfaceID) internal {
        require(interfaceID != 0xffffffff,"Invalid Interface ID");
        _supportedeInterfaces[interfaceID]= true;
    }





}