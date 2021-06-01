import React from "react";
import { useDispatch } from "react-redux";
import { initWeb3 } from "../store/adoptionSlice";
import NavBar from "./NavBar";
function MetaMask() {
  const dispatch = useDispatch();
  return (
    <div style={{ left: "50%", right: "50%" }}>
      <button
        style={{ padding: "10px", marginTop: "50px" }}
        onClick={() => {
          dispatch(initWeb3());
        }}
      >
        <img
          src="https://docs.metamask.io/metamask-fox.svg"
          alt="metamask logo"
          style={{ width: 35, height: 35 }}
        />
        <span>Metamask</span>
      </button>
    </div>
  );
}

export default MetaMask;
