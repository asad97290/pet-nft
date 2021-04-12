import React, { useEffect } from "react";
import NavBar from "./NavBar.js";
import { useDispatch,useSelector } from "react-redux";
import { adoptPet, initWeb3, setAccount} from "../store/adoptionSlice";


function Home() {
  const dispatch = useDispatch();
  window.ethereum.on("accountsChanged", function (accounts) {
    dispatch(setAccount(accounts[0]));
    window.location.reload();
  });
  const {allPets,address} = useSelector((state) => {
    return state.adoptionReducer;
  })
  useEffect(() => {
    dispatch(initWeb3());
  }, []);
  return (
    <div className="bg-light">
      <div>
        <NavBar />
      </div>
      <div style={{marginTop: 60}}>
      {allPets.map((pet, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid black",
                    display: "inline-block",
                    margin: "10px",
                    padding: "20px",
                  }}
                >
                  <h1>{pet.name}</h1>
                  <img src={pet.picture} width="200px" />
                  <div>Age: {pet.age} Years</div>
                  <div>Breed: {pet.breed}</div>
                  <div>Location: {pet.location}</div>
                  <div>Price: {pet.Price} ETH</div>
                  {/* <div>Owner: {address}</div> */}

                  {
                    <button
                      style={{ margin: "10px" }}
                      onClick={() => {
                        dispatch(adoptPet({petId:index+1,petPrice:pet.Price}));
                      }}
                    >
                      Adopt
                    </button>
                  }
                </div>
              ))}
      </div>
    </div>
  );
}

export default Home;
