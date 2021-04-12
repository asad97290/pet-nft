import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AddPet from "../components/AddPet";
import Home from "../components/Home";
import PetList from "../components/PetList";

export default function Routers() {
  return (
    <div>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/addNft" component={AddPet} />
          <Route path="/viewNft" component={PetList} />
          <Route path="*" component={() => <h2>Page Not Found</h2>} />
        </Switch>
      </Router>
    </div>
  );
}
