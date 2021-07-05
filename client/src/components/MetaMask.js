import React from "react";
import { Link } from "react-router-dom";

function MetaMask() {
  return (
    <div>
    <div style={{position:"absolute",top:"50%",left:"50%" ,transform:"translate(-50%,-50%)"}}>
      <Link
        className="btn btn-success"
        to="/home"
      >
        <img
          src="https://docs.metamask.io/metamask-fox.svg"
          alt="metamask logo"
          style={{ width: 35, height: 35 }}
        />
        <span> Metamask</span>
      </Link>
    </div>
    </div>
  );
}

export default MetaMask;
