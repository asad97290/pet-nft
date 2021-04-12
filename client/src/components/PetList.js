import React, { useEffect, useState } from "react";
// import pets from "../pets.json";
import { useDispatch, useSelector } from "react-redux";
import { adoptPet, getAdopters } from "../store/adoptionSlice";
import NavBar from "./NavBar";

export default function PetList() {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const { isLoading, errorMessage, error, address, pets } = useSelector(
    (state) => {
      return state.adoptionReducer;
    }
  );

  const _pets = useSelector((state) => {
    return state.adoptionReducer.pets;
  });

  useEffect(() => {
  console.log(_pets)
    setLoading(true);



    setTimeout(() => {
      dispatch(getAdopters());

      setLoading(false);
    }, 10000);
  }, []);

  return (
    <div>
      <NavBar />
      {!loading ? (
        <div>
          <h3 style={{marginTop: 60}}>Account:{address}</h3>
          {isLoading ? (
            <img id="overlay" src="images/progress.gif" alt="progress.gif" />
          ) : (
            <div>
              {error ? <p style={{ color: "red" }}>{errorMessage}</p> : null}

              {pets.map((pet, index) => (
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
          )}
        </div>
      ) : (
        <img id="overlay" src="images/progress.gif" alt="progress.gif" />
      )}
    </div>
  );
}
