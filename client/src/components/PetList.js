import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdopters } from "../store/adoptionSlice";
import NavBar from "./NavBar";

export default function PetList() {
  const dispatch = useDispatch();

  const { isLoading, address, pets } = useSelector((state) => {
    return state.adoptionReducer;
  });

  useEffect(() => {
    console.log(isLoading);
    dispatch(getAdopters());
    console.log(isLoading);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="bg-light">
      <NavBar />
      {!isLoading ? (
        <div style={{ marginTop: 60 }}>
          <h1>My Pet</h1>
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
              <img src={pet.image} alt="pet pic" width="200px" />
              <div>Age: {pet.attributes[0].value} Years</div>
              <div>Breed: {pet.attributes[1].value}</div>
              <div>Location: {pet.attributes[2].value}</div>
              <div>Price: {pet.Price} ETH</div>
              <div>
                Owner: {address.slice(0, 6)}...
                {address.slice(address.length - 4)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <img id="overlay" src="images/progress.gif" alt="progress.gif" />
      )}
    </div>
  );
}
