const AnimalsNft = artifacts.require("./AnimalsNft.sol"); //git the file animalsnft.sol
const {assert,should} = require("chai");
require("chai").use(require('chai-as-promised')).should();

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

contract('AnimalsNft',(accounts)=>{
    let contract;
    before(async()=>{
        contract = await AnimalsNft.deployed();


    })
    describe("Deploy the contract", async()=>{

        it("contract is deployed", async()=>{
            const address = contract.address;

            assert.notEqual(address,"");
            assert.notEqual(address,0x0);
            assert.notEqual(address,null);
            assert.notEqual(address, undefined);

        })
        it("valid name", async()=>{
            const name = await contract.name()
            assert.equal(name, "AnimalsNFT2", "the name is AnimalsNFT2");
        })
        it("valid symbol", async()=>{
            const symbol = await contract.symbol()
            assert.equal(symbol, "ANI2", "the symbol is ANI2");
        })

    })
    ////Mint new fase
    describe("mint NFT in your contract", async()=>{
        it("create NFT Token", async()=>{
            const nftResult = await contract.mint("https://unsplash1.com");
            const totalSu = await contract.totalSupply();
            // console.log(event);

            const event = nftResult.logs[0].args 
            assert.equal(event.to,accounts[0]);
            assert.equal(totalSu, 1,);
            await contract.mint("https://unsplash1.com").should.be.rejected;

        })
    })

    describe("search for nfts store", async()=>{
        it("add list of nfts", async()=>{
            await contract.mint("https://unsplash2.com");
            await contract.mint("https://unsplash3.com");
            await contract.mint("https://unsplash4.com");
            await contract.mint("https://unsplash5.com");
            const totalSu = await contract.totalSupply();
            assert.equal(totalSu, 5);

            let nftToken =[];
            let nft;
            for(i=0; i< totalSu; i++){
                nft = await contract.animalsNft(i);
                nftToken.push(nft);
            }

            let myArray = [
                'https://unsplash1.com',
                'https://unsplash2.com',
                'https://unsplash3.com',
                'https://unsplash4.com',
                'https://unsplash5.com'
              ];
              assert.equal(nftToken.join(","), myArray.join(","));
              
        })
    })
    




})


