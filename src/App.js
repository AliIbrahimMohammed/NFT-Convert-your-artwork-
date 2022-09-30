import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";
import React,{ Component, useEffect, useState} from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import {webUrl} from 'fast-check';
import Web3 from "web3";
import { Buffer } from 'buffer';
import { create } from 'ipfs-http-client'



const projectId = '2FM6Sv3aHPQyYiBZ4omErM4KrGv';
const projectSecret = 'b1b768bc7480c19e458115188b0f51dc';
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const options = {
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
};

const ipfsClient = create(options);


function App() {
  const [web3Api,setWeb3Api] = useState({
    provider:null,
    web3:null
  })

///Create Reload
const providerChanged =(provider)=>{
  provider.on("accountsChanged", _=>window.location.reload());
  provider.on("chainChanged", _=>window.location.reload());
}  

  useEffect(()=>{
    const loadProvider = async()=>{
      const provider = await detectEthereumProvider();
      if(provider){
        providerChanged(provider);
        setWeb3Api({
          provider,
          web3: new Web3(provider)
        })


      }else{
        console.log("No provider please install Metamask")
      }
    }
    loadProvider();
  },[])

///Create hook for Get Accounts
  const [account,setAccount] = useState(null);
  useEffect(()=>{
    const getAccounts = async ()=>{
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
      console.log(accounts)
    }
    web3Api.web3 && getAccounts()
  },[web3Api.web3])
  
///Load the contract content
  const [contract,setContract] = useState(null);
  const [totalSupply,setTotalSupply]=useState()
  const [animals,setAnimals] = useState([]); 
  useEffect(()=>{
    const loadContract = async()=>{
      const contractFile = await fetch('/abis/AnimalsNft.json');
      const convertContractFlieToJson = await contractFile.json();
      const abi = convertContractFlieToJson.abi
      const networkId = await web3Api.web3.eth.net.getId();
      const networkObject = convertContractFlieToJson.networks[networkId]
      if(networkObject){
      const address = networkObject.address;
      const deployedContract = await new web3Api.web3.eth.Contract(abi,address);
      setContract(deployedContract);
      const totalSupply = await deployedContract.methods.totalSupply().call()
      setTotalSupply(totalSupply)
      for(let i=1; i<=totalSupply;i++){
        const singleAnimalsNft = await deployedContract.methods.animalsNft(i-1).call();
        setAnimals(animals=>[...animals,singleAnimalsNft]);
      }
        console.log(animals)
      
      }else{
        window.alert("Please Conect with Goerli Network")
      }
      
    }
    web3Api.web3 && loadContract();
  },[web3Api.web3])  
///start to upload imges to ipfs function
///`https://alinfts.infura-ipfs.io/ipfs/${addFile.path}`
  const [urlHash,setUrlHash] = useState()
  const onChange = async(e)=>{
    const file = e.target.files[0];
    try{
      const addFile = await ipfsClient.add(file)
      const hash = addFile.path
      setUrlHash(hash);

    }catch(e){
    console.log("this error when upload the image",e)
  }

}

////Start create the mint function
  const  mint = async()=>{
    if(urlHash && urlHash!=null && urlHash!==""){
      await contract.methods.mint(urlHash).send({from:account});
      window.location.reload()
    }else{
      window.alert("you should upload imge frist to IPFS")
    }
  }    



  return (
        <div className='App'>
        {/**^^^^^^^^^^^^^^navbar^^^^^^^^^^^^^^^^^^^^^^^^ */}
    <nav className="navbar navbar-dark bg-dark">
          <div className="container-fluid">
          <a className="navbar-brand"><h4><span className='text-warning'>ALI</span><span className='text-info'>_</span><span className='text-info'>NFT</span><span className='text-warning'>s</span></h4></a>
        <form className="d-flex" role="search">
      <button className="btn btn-warning" type="submit">My Acoount is :{account}</button>
      </form>
      </div>
    </nav>
      {/**&&&&&&&&&&&&&&&&&&naber&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */}
    <br></br>
      {/**^^^^^container^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
        <div className='container'>
      {/**^^^^^^^^^^^^^^slogan^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ */}
      <div className='solgan'>
        <div className="p-5 p-md-12 mb-12 rounded text-bg-dark">
          <div className="col-md-12 px-12">
      <h1 className="display-5 fst-italic"><span className='text-warning'>Convert</span> your artwork or personal drawings or photos to <span className='text-info'>NFTs</span></h1>
      <p className="lead my-6">This site puts your paintings or drawings in the <span className='text-info'>Blockchain network</span> and gives it its own <span className='text-warning'>Hash</span> that cannot be repeated. You can also prove your ownership with this Hash, and this also depends on the authenticity of what you upload. know more about <span className='text-warning'>non-fungible</span> or unique tokens on the Ethereum blockchain</p>
      <a className='btn btn-primary' href="https://ethereum.org/en/nft/" class="text-white fw-bold btn btn-primary">Continue reading...</a>
      </div>
      {/**&&&&&&&&&&&&&&&slogan&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& */}
        </div>
        <hr className='my-2  text-primary'/>
        {/** start upload */}
          <div className='uploader'>
              <div className="input-group mb-3">
            <input type="file" className="form-control" id="inputGroupFile02" onChange={onChange}/>
            <label className="input-group-text" for="inputGroupFile02">Upload</label>
            </div>

          </div>
        {/** end upload */}
        {/** start Hash section */}
            <div className='Hash'>
            <div className="alert alert-primary d-flex align-items-center" role="alert">
            <svg className="svg-icon" width={30} height={30} viewBox="0 0 20 20">
              <path d="M16.469,8.924l-2.414,2.413c-0.156,0.156-0.408,0.156-0.564,0c-0.156-0.155-0.156-0.408,0-0.563l2.414-2.414c1.175-1.175,1.175-3.087,0-4.262c-0.57-0.569-1.326-0.883-2.132-0.883s-1.562,0.313-2.132,0.883L9.227,6.511c-1.175,1.175-1.175,3.087,0,4.263c0.288,0.288,0.624,0.511,0.997,0.662c0.204,0.083,0.303,0.315,0.22,0.52c-0.171,0.422-0.643,0.17-0.52,0.22c-0.473-0.191-0.898-0.474-1.262-0.838c-1.487-1.485-1.487-3.904,0-5.391l2.414-2.413c0.72-0.72,1.678-1.117,2.696-1.117s1.976,0.396,2.696,1.117C17.955,5.02,17.955,7.438,16.469,8.924 M10.076,7.825c-0.205-0.083-0.437,0.016-0.52,0.22c-0.083,0.205,0.016,0.437,0.22,0.52c0.374,0.151,0.709,0.374,0.997,0.662c1.176,1.176,1.176,3.088,0,4.263l-2.414,2.413c-0.569,0.569-1.326,0.883-2.131,0.883s-1.562-0.313-2.132-0.883c-1.175-1.175-1.175-3.087,0-4.262L6.51,9.227c0.156-0.155,0.156-0.408,0-0.564c-0.156-0.156-0.408-0.156-0.564,0l-2.414,2.414c-1.487,1.485-1.487,3.904,0,5.391c0.72,0.72,1.678,1.116,2.696,1.116s1.976-0.396,2.696-1.116l2.414-2.413c1.487-1.486,1.487-3.905,0-5.392C10.974,8.298,10.55,8.017,10.076,7.825"></path>
            </svg>
                  {
                animals[totalSupply-1]?
                  <div className='p-2'>
                Last NFT Hash : {animals[totalSupply-1]}
                </div>:
                <div className='p-2'>
                You Don`t Have Any NFT Minted, Please Min One 
                </div>

                  } 
              </div>

            </div>
      </div>
      {/** end hash      */}
      
            {/** start mint  buton      */}
            {
              urlHash?
              <div>
              <button onClick={mint} type="button" className="btn btn-outline-success  p-2"> <svg className="svg-icon" width={30} height={30}  viewBox="0 0 20 20">
                <path fill="currentColor" d="M8.652,16.404c-0.186,0-0.337,0.151-0.337,0.337v2.022c0,0.186,0.151,0.337,0.337,0.337s0.337-0.151,0.337-0.337v-2.022C8.989,16.555,8.838,16.404,8.652,16.404z"></path>
                <path fill="currentColor" d="M11.348,16.404c-0.186,0-0.337,0.151-0.337,0.337v2.022c0,0.186,0.151,0.337,0.337,0.337s0.337-0.151,0.337-0.337v-2.022C11.685,16.555,11.535,16.404,11.348,16.404z"></path>
                <path fill="currentColor" d="M17.415,5.281V4.607c0-2.224-1.847-4.045-4.103-4.045H10H6.687c-2.256,0-4.103,1.82-4.103,4.045v0.674H10H17.415z"></path>
                <path fill="currentColor" d="M18.089,10.674V7.304c0,0,0-0.674-0.674-0.674V5.955H10H2.585v0.674c-0.674,0-0.674,0.674-0.674,0.674v3.371c-0.855,0.379-1.348,1.084-1.348,2.022c0,1.253,2.009,3.008,2.009,3.371c0,2.022,1.398,3.371,3.436,3.371c0.746,0,1.43-0.236,1.98-0.627c-0.001-0.016-0.009-0.03-0.009-0.047v-2.022c0-0.372,0.303-0.674,0.674-0.674c0.301,0,0.547,0.201,0.633,0.474h0.041v-0.137c0-0.372,0.303-0.674,0.674-0.674s0.674,0.302,0.674,0.674v0.137h0.041c0.086-0.273,0.332-0.474,0.633-0.474c0.371,0,0.674,0.302,0.674,0.674v2.022c0,0.016-0.008,0.03-0.009,0.047c0.55,0.391,1.234,0.627,1.98,0.627c2.039,0,3.436-1.348,3.436-3.371c0-0.362,2.009-2.118,2.009-3.371C19.438,11.758,18.944,11.053,18.089,10.674z M5.618,18.089c-0.558,0-1.011-0.453-1.011-1.011s0.453-1.011,1.011-1.011s1.011,0.453,1.011,1.011S6.177,18.089,5.618,18.089z M6.629,13.371H5.474c-0.112,0-0.192-0.061-0.192-0.135c0-0.074,0.08-0.151,0.192-0.174l1.156-0.365V13.371z M8.652,12.521c-0.394,0.163-0.774,0.366-1.148,0.55c-0.061,0.03-0.132,0.052-0.2,0.076v-0.934c0.479-0.411,0.906-0.694,1.348-0.879V12.521z M5.281,10c-1.348,0-1.348-2.696-1.348-2.696h5.393C9.326,7.304,6.629,10,5.281,10z M10.674,12.296c-0.22-0.053-0.444-0.084-0.674-0.084s-0.454,0.032-0.674,0.084v-1.168C9.539,11.086,9.762,11.06,10,11.05c0.238,0.01,0.461,0.036,0.674,0.078V12.296z M12.696,13.146c-0.068-0.024-0.14-0.046-0.2-0.076c-0.374-0.184-0.754-0.386-1.148-0.55v-1.188c0.442,0.185,0.87,0.467,1.348,0.879V13.146zM14.382,18.089c-0.558,0-1.011-0.453-1.011-1.011s0.453-1.011,1.011-1.011c0.558,0,1.011,0.453,1.011,1.011S14.94,18.089,14.382,18.089z M13.371,13.371v-0.674l1.156,0.365c0.112,0.022,0.192,0.099,0.192,0.174c0,0.074-0.08,0.135-0.192,0.135H13.371z M14.719,10c-1.348,0-4.045-2.696-4.045-2.696h5.393C16.067,7.304,16.067,10,14.719,10z"></path>
                <path fill="currentColor" d="M10,16.067c-0.186,0-0.337,0.151-0.337,0.337V19.1c0,0.186,0.151,0.337,0.337,0.337s0.337-0.151,0.337-0.337v-2.696C10.337,16.218,10.186,16.067,10,16.067z"></path>
              </svg>Mint your NFT </button>
              </div> :
              <div>
              <button onClick={mint} type="button" className=" disabled btn btn-outline-success  p-2"> <svg className="svg-icon" width={30} height={30}  viewBox="0 0 20 20">
                <path fill="currentColor" d="M8.652,16.404c-0.186,0-0.337,0.151-0.337,0.337v2.022c0,0.186,0.151,0.337,0.337,0.337s0.337-0.151,0.337-0.337v-2.022C8.989,16.555,8.838,16.404,8.652,16.404z"></path>
                <path fill="currentColor" d="M11.348,16.404c-0.186,0-0.337,0.151-0.337,0.337v2.022c0,0.186,0.151,0.337,0.337,0.337s0.337-0.151,0.337-0.337v-2.022C11.685,16.555,11.535,16.404,11.348,16.404z"></path>
                <path fill="currentColor" d="M17.415,5.281V4.607c0-2.224-1.847-4.045-4.103-4.045H10H6.687c-2.256,0-4.103,1.82-4.103,4.045v0.674H10H17.415z"></path>
                <path fill="currentColor" d="M18.089,10.674V7.304c0,0,0-0.674-0.674-0.674V5.955H10H2.585v0.674c-0.674,0-0.674,0.674-0.674,0.674v3.371c-0.855,0.379-1.348,1.084-1.348,2.022c0,1.253,2.009,3.008,2.009,3.371c0,2.022,1.398,3.371,3.436,3.371c0.746,0,1.43-0.236,1.98-0.627c-0.001-0.016-0.009-0.03-0.009-0.047v-2.022c0-0.372,0.303-0.674,0.674-0.674c0.301,0,0.547,0.201,0.633,0.474h0.041v-0.137c0-0.372,0.303-0.674,0.674-0.674s0.674,0.302,0.674,0.674v0.137h0.041c0.086-0.273,0.332-0.474,0.633-0.474c0.371,0,0.674,0.302,0.674,0.674v2.022c0,0.016-0.008,0.03-0.009,0.047c0.55,0.391,1.234,0.627,1.98,0.627c2.039,0,3.436-1.348,3.436-3.371c0-0.362,2.009-2.118,2.009-3.371C19.438,11.758,18.944,11.053,18.089,10.674z M5.618,18.089c-0.558,0-1.011-0.453-1.011-1.011s0.453-1.011,1.011-1.011s1.011,0.453,1.011,1.011S6.177,18.089,5.618,18.089z M6.629,13.371H5.474c-0.112,0-0.192-0.061-0.192-0.135c0-0.074,0.08-0.151,0.192-0.174l1.156-0.365V13.371z M8.652,12.521c-0.394,0.163-0.774,0.366-1.148,0.55c-0.061,0.03-0.132,0.052-0.2,0.076v-0.934c0.479-0.411,0.906-0.694,1.348-0.879V12.521z M5.281,10c-1.348,0-1.348-2.696-1.348-2.696h5.393C9.326,7.304,6.629,10,5.281,10z M10.674,12.296c-0.22-0.053-0.444-0.084-0.674-0.084s-0.454,0.032-0.674,0.084v-1.168C9.539,11.086,9.762,11.06,10,11.05c0.238,0.01,0.461,0.036,0.674,0.078V12.296z M12.696,13.146c-0.068-0.024-0.14-0.046-0.2-0.076c-0.374-0.184-0.754-0.386-1.148-0.55v-1.188c0.442,0.185,0.87,0.467,1.348,0.879V13.146zM14.382,18.089c-0.558,0-1.011-0.453-1.011-1.011s0.453-1.011,1.011-1.011c0.558,0,1.011,0.453,1.011,1.011S14.94,18.089,14.382,18.089z M13.371,13.371v-0.674l1.156,0.365c0.112,0.022,0.192,0.099,0.192,0.174c0,0.074-0.08,0.135-0.192,0.135H13.371z M14.719,10c-1.348,0-4.045-2.696-4.045-2.696h5.393C16.067,7.304,16.067,10,14.719,10z"></path>
                <path fill="currentColor" d="M10,16.067c-0.186,0-0.337,0.151-0.337,0.337V19.1c0,0.186,0.151,0.337,0.337,0.337s0.337-0.151,0.337-0.337v-2.696C10.337,16.218,10.186,16.067,10,16.067z"></path>
              </svg>Mint your NFT </button>
              </div>
            }
          {/** end mint buton     */}
          <hr className='my-2  text-primary'/>
        
            </div>
        {/**  END container*/}
        {/** start  newest nft section      */}
          <div className='col'>
            <div className='heading'>
            <h1 className="display-1 text-black"> The Newest <span className='text-info'>NFT</span><span className='text-warning'>s</span></h1>
            </div>
          </div>
          {/** start 4 imgs  newest nft section      */}
              {
                totalSupply>=5?
              <div className="container text-center ">
                    <div className="row mx-4">
                      <div className="col p-2">
                      <img src={`https://alinfts.infura-ipfs.io/ipfs/${animals[totalSupply-1]}`} width={200}  className="rounded float-none" alt="..."/>
                      </div>
                  <div className="col p-2">
                  <img src={`https://alinfts.infura-ipfs.io/ipfs/${animals[totalSupply-2]}`} width={200}  className="rounded float-none" alt="..."/>
                  </div>
                  <div className="col p-2">
                  <img src={`https://alinfts.infura-ipfs.io/ipfs/${animals[totalSupply-3]}`} width={200}  className="rounded float-none" alt="..."/>
                    </div>
                  <div className="col p-2">
                  <img src={`https://alinfts.infura-ipfs.io/ipfs/${animals[totalSupply-4]}`} width={200}  className="rounded float-none" alt="..."/>
                    </div>
                </div>
              </div>:<h1>Don`t Have 4 Images</h1>
          }   
          {/** end  4 imgs  newest nft section      */}
          {/** end  newest nft section     */}
          <hr className='my-2 p-1 text-primary'/>
          {/** start totalsupply section     */}
          <div className='p-3 m-3'>
            <h1 className="display-1 text-warning bg-black rounded p-2 "><span className='text-info'>NFT</span><span className='text-warning'>s</span> Count is <span className='text-white'>{totalSupply}</span></h1>
            </div>
          {/** end totalsupply section     */}
          <hr className='my-2 p-1 text-primary'/>
        {/** start  newest nft section      */}
          <div className='col'>
            <div className='heading'>
            <h1 className="display-1 text-black">Discover All <span className='text-info'>NFT</span><span className='text-warning'>s</span></h1>
            </div>
          </div>
          {/** start ALL imgs  newest nft section      */}
          <div>
          <div className="allSectyon">
                <div className="row mx-4">

                  {
                    animals.map((animalHash,key)=>{
                      return(
                        <div className="col p-2">
                        <img src={`https://alinfts.infura-ipfs.io/ipfs/${animalHash}`} width={200}  className="rounded float-none" alt="..."/>
                          </div>
                      )
                    })
                  }
                
              </div>
          </div>

          </div>
          {/** end  ALL imgs  newest nft section      */}
           {/** end  newest nft section      */}
            {/** start  foter section      */}
                    <div class="container">
          <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
              <ul class="nav justify-content-center border-bottom pb-3 mb-3">
          <li class="nav-item"><a href="#" class="nav-link px-2 text-muted">Home</a></li>
          <li class="nav-item"><a href="https://www.youtube.com/c/Freelance4arabs" class="nav-link px-2 text-muted">Learn more about Dapps</a></li>
          <li class="nav-item"><a href="https://github.com/AliIbrahimMohammed" class="nav-link px-2 text-muted">About me </a></li>
        </ul>
        <p class="text-center text-muted">&copy; 2022 ALTAYB ,All rights reserved to me  </p>
          </footer>
        </div>
           
             {/** end  foter section      */}


      </div>
    );

};
export default App;