import React, { useState } from "react";
import Web3 from "web3";
import { useDispatch, useSelector } from "react-redux";
import { mintPet } from "../store/adoptionSlice";
import NavBar from "./NavBar";
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
  const { isLoading } = useSelector((state) => {
    return state.adoptionReducer;
  });
  const showFile = async (e) => {
    e.preventDefault();
    const reader = new window.FileReader();

    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onloadend = async () => {
      setImageBuffer(Buffer(reader.result));
    };
  };

  const uploadImage = async () => {
    await ipfs.files.add(imgBuffer, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(`https://gateway.pinata.cloud/ipfs/${result[0].hash}`)
      
      mintToken(result[0].hash);
    });
  };

  const mintToken = (hash) => {
    const p = web3.utils.toWei(document.getElementById("price").value);
    //to publish token metadata to IPFS

    const data = JSON.stringify({
      name: document.getElementById("name").value,
      image: `https://gateway.pinata.cloud/ipfs/${hash}`,
      description:
        "Friendly OpenSea Creature that enjoys long swims in the ocean.",
      attributes: [
        {
          trait_type: "Age",
          value: document.getElementById("age").value,
        },
        {
          trait_type: "Breed",
          value: document.getElementById("breed").value,
        },
        {
          trait_type: "Location",
          value: document.getElementById("location").value,
        },
      ],

      Price: document.getElementById("price").value, 
    });

    ipfs.files.add(Buffer(data)).then((cid) => {
      let petURI = `https://gateway.pinata.cloud/ipfs/${cid[0].hash}`;
      dispatch(mintPet({ petURI, petPrice: p }));
    });
  };

  return (
    <div>
      <NavBar />

      {isLoading ? (
        <img id="overlay" src="images/progress.gif" alt="progress.gif" />
      ) : (
        <div style={{ marginTop: 60 }}>
          <div>
            Name: <input id="name" />
          </div>
          <div>
            Age: <input id="age" />
          </div>
          <div>
            Breed: <input id="breed" />
          </div>
          <div>
            Price: <input id="price" />
          </div>
          <div>
            Location: <input id="location" />
          </div>
          <input onChange={(e) => showFile(e)} type="file" id="file1" />
          <button onClick={uploadImage} className="btn btn-success">
            submit
          </button>
        </div>
      )}
    </div>
  );
}
