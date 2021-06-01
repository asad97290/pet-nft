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
        <Link style={{ color: "white",textDecoration:"none"}} to="/"><h3> Pet Shop</h3></Link>
        <div style={{color:"gray",marginLeft: "350px"}}>{address}</div>
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
        
        <div className="collapse navbar-collapse ml-auto" id="navbarNavAltMarkup">
          <div className="navbar-nav" style={{marginLeft:"auto"}}>
          <Link className="nav-item nav-link " to="/">
              Home
            </Link>
            <Link className="nav-item nav-link " to="/viewNft">
              Profile
            </Link>
           
            {address === owner ? (
              <Link className="nav-item nav-link " to="/addNft">
                Create
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
