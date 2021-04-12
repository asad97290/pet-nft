import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
export default function NavBar() {
  const { owner, address } = useSelector((state) => {
    return state.adoptionReducer;
  });
  return (
    <div className="container">
      <nav className="navbar navbar-dark bg-dark fixed-top flex-md-nowrap navbar-expand-lg">
        <h3 style={{ color: "white" }}> Pet Shop</h3>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ml-auto">
            <Link className="nav-item nav-link " to="/viewNft">
              View My Nft
            </Link>
            {address === owner ? (
              <Link className="nav-item nav-link " to="/addNft">
                Add Nft
              </Link>
            ) : (
              <></>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
