import React, { useEffect } from "react";
import NavBar from "./NavBar.js";
import { useDispatch, useSelector } from "react-redux";
import { adoptPet, initWeb3, setAccount } from "../store/adoptionSlice";
import { Link } from "react-router-dom";
function Home() {
  const dispatch = useDispatch();

  window.ethereum.on("accountsChanged", function (accounts) {
    dispatch(setAccount(accounts[0]));
    window.location.reload();
  });
  const { allPets, isLoading } = useSelector((state) => {
    return state.adoptionReducer;
  });
  useEffect(() => {
    dispatch(initWeb3());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="bg-light">
      <NavBar />
      {isLoading ? (
        <img id="overlay" src="images/progress.gif" alt="progress.gif" />
      ) : (
        <div style={{ marginTop: 60 }}>
          <h1>Pet NFT Market place</h1>
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
              <h1>{pet.data.name}</h1>
              <img src={pet.data.image} width="200px" alt="pet" />
              <div>Price: {pet.data.Price} ETH</div>
              <div>
                Owner: {pet.tokenOwner.slice(0, 6)}...
                {pet.tokenOwner.slice(pet.tokenOwner.length - 4)}
              </div>

              <button
                className="btn btn-success"
                style={{ margin: "10px" }}
                onClick={() => {
                  dispatch(
                    adoptPet({ petId: index + 1, petPrice: pet.data.Price })
                  );
                }}
              >
                Buy
              </button>

              <Link
                className="btn btn-danger"
                style={{ margin: "10px" }}
                to={{
                  pathname: "/viewDetail",
                  data: {
                     pet,
                    petId: index + 1,
                  },
                }}
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
