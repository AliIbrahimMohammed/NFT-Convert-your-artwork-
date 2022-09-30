const ERC721Metadata = artifacts.require("ERC721Metadata");

module.exports = function (deployer) {
  deployer.deploy(ERC721Metadata,"AnimalsNFT","Ani");
};
