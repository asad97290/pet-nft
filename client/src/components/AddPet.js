import React, { useState } from 'react'
import Web3 from "web3"
import { useDispatch } from "react-redux";
import { mintPet } from "../store/adoptionSlice";
import NavBar from './NavBar';
const ipfsClient = require("ipfs-api");
const ipfs = ipfsClient({ 
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});
export default function AddPet() {
    let [imgBuffer, setImageBuffer] = useState("");
const web3 = new Web3();
  const dispatch = useDispatch();
  
    const showFile = async (e) => {
        e.preventDefault();
        const reader = new window.FileReader();
    
        reader.readAsArrayBuffer(e.target.files[0]);
        reader.onloadend = async () => {
          setImageBuffer(Buffer(reader.result));
          // console.log("in-----", Buffer(reader.result));
        };
      };
    
      const uploadImage = async () => {
        // console.log("+++++++++++++++++++++", imgBuffer);
        await ipfs.files.add(imgBuffer, (err, result) => {
          if (err) {
            console.log(err);
          }
          // console.log(`https://gateway.pinata.cloud/ipfs/${result[0].hash}`);
    
          mintToken(result[0].hash);
        });
      };
    
      const mintToken = (hash) => {
        const p = web3.utils.toWei(document.getElementById("price").value)
        console.log(p)
        //to publish token metadata to IPFS
        const data = JSON.stringify({
          name: document.getElementById("name").value,
          picture: `https://gateway.pinata.cloud/ipfs/${hash}`,
          age: document.getElementById("age").value,
          breed: document.getElementById("breed").value,
          location: document.getElementById("location").value,
          Price:  document.getElementById("price").value // in wei (10**18 wei = 1 eth)
        });
    
        ipfs.files.add(Buffer(data)).then((cid) => {
          let petURI = `https://gateway.pinata.cloud/ipfs/${cid[0].hash}`
          // now you can call NFT contract function and mint new token or set this uri to your token
          console.log(petURI);
          dispatch(mintPet({petURI,petPrice:p}))
        });
      };
    
      return (
        <div>
          <NavBar />
          <div style={{marginTop: 60}}>
           <div>Name: <input id="name"/></div>
           <div>Age: <input id="age"/></div>
           <div>Breed: <input id="breed"/></div>
           <div>Price: <input id="price"/></div> 
           <div>Location: <input id="location"/></div>
          <input onChange={(e) => showFile(e)} type="file" id="file1" />
          <button onClick={uploadImage} className="btn btn-success">
            submit
          </button>
          </div>
        </div>
      );
    }












