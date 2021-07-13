import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransferHistory } from "../store/adoptionSlice";
export default function ViewDetail(props) {
  const dispatch = useDispatch();
  const { transferHistory, web3 } = useSelector((state) => {
    return state.adoptionReducer;
  });
  useEffect(() => {
    dispatch(getTransferHistory(props.location.data.petId));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container">
      <h1>{props.location.data.pet.data.name}</h1>
      <img
        src={props.location.data.pet.data.image}
        width="200px"
        alt="pet pic"
      />
      <h3>Details</h3>
      <div>Age: {props.location.data.pet.data.attributes[0].value} Years</div>
      <div>Breed: {props.location.data.pet.data.attributes[1].value}</div>
      <div>Location: {props.location.data.pet.data.attributes[2].value}</div>
      <div>Price: {props.location.data.pet.data.Price} ETH</div>
      View on IPFS:{" "}
      <a href={props.location.data.pet.uri} target="_blank" rel="noreferrer">
        view json metadata
      </a>
      <div>
        Owner: {props.location.data.pet.tokenOwner.slice(0, 6)}...
        {props.location.data.pet.tokenOwner.slice(
          props.location.data.pet.tokenOwner.length - 4
        )}
      </div>
      <br />
      <h3>Trading History</h3>
      <table>
        <tr>
          <th>from</th>
          <th>to</th>
          <th>amount</th>
          <th>date</th>
          <th>tx hash</th>
        </tr>
        {transferHistory.map((item, index) => (
          <tr key={index}>
            <td>
              {" "}
              {item.returnValues.oldOwner.slice(0, 6)}...
              {item.returnValues.oldOwner.slice(
                item.returnValues.oldOwner.length - 4
              )}
            </td>
            <td>
              {" "}
              {item.returnValues.newOwner.slice(0, 6)}...
              {item.returnValues.newOwner.slice(
                item.returnValues.newOwner.length - 4
              )}
            </td>

            <td>{web3.utils.fromWei(item.returnValues.price, "Ether")} ETH</td>
            <td>{new Date(item.returnValues.date * 1000).toLocaleString()}</td>

            <td> <a href={`https://rinkeby.etherscan.io/tx/${item.transactionHash}`} target="_blank" rel="noreferrer">
        {item.transactionHash.slice(0, 16)}
      </a></td>
            
          </tr>
        ))}
   
      </table>
    </div>
  );
}
