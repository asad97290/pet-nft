import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Web3 from "web3";
import Adoption from "../contracts/PetShop.json";
import axios from "axios";
export const initWeb3 = createAsyncThunk("InitWeb3", async (_,thunkAPI) => {
  try {
    if (Web3.givenProvider) {
      const web3 = new Web3(Web3.givenProvider);
      await Web3.givenProvider.enable();
      const networkId = await web3.eth.net.getId();
      const contract = new web3.eth.Contract(
        Adoption.abi,
        Adoption.networks[networkId].address
      );
      console.log("++++++++++++++",contract)
      const addresses = await web3.eth.getAccounts();
      let numberOfPets = await contract.methods.totalSupply().call();
      let owner = await contract.methods.owner().call()
      let _pets = []
      for(let i=1;i<=numberOfPets;i++){
        console.log("inside for loop")
        // let tokens = await contract.methods.tokenByIndex(i-1).call();
        let adoptersArray = await contract.methods.tokenURI(i).call();
        let {data} = await axios.get(adoptersArray)
       
          console.log(data)
          _pets.push(data)
        
      }

      return {
        web3,
        contract,
        address: addresses[0],
        _pets,
        owner
      };
    }
  } catch (e) {
    console.log(e);
  }
});

export const getAdopters = createAsyncThunk(
  "GetAdopters",
  async (_, thunkAPI) => {
    try {
      const { contract,address } = thunkAPI.getState().adoptionReducer;
      let numberOfPets = await contract.methods.balanceOf(address).call();
      let _pets = []
      for(let i=1;i<=numberOfPets;i++){
        let adoptersArray = await contract.methods.tokenURI(i).call();
        let {data} = await axios.get(adoptersArray)
       
          console.log(data)
          _pets.push(data)
        
      }
      return _pets;
    } catch (e) {
      console.log(e);
    }
  }
);

export const adoptPet = createAsyncThunk(
  "AdoptPet",
  async (data, thunkAPI) => {
    
    const { contract, web3,address } = thunkAPI.getState().adoptionReducer;
    // console.log(address,"..................",await web3.utils.toHex(web3.utils.toWei("0.1", "ether")))
    let result = await contract.methods.buyPetNft(data.petId).send({ from:address, value: web3.utils.toWei(data.petPrice,"ether")});

    return { from: result.from };
  }
);
export const mintPet = createAsyncThunk(
  "MintPet",
  async (data, thunkAPI) => {
    
    const { contract, address } = thunkAPI.getState().adoptionReducer;
console.log(typeof data.petPrice);
    let result = await contract.methods.mintPetNft(data.petURI,data.petPrice).send({ from: address});
    console.log(result)

    return { from: result.from };
  }
);
// export const unAdoptPet = createAsyncThunk(
//   "UnAdoptPet",
//   async (petId, thunkAPI) => {
//     const { contract, address } = thunkAPI.getState().adoptionReducer;
//     let result = await contract.methods.unAdopt(petId).send({ from: address });

//     return { from: result.from, petId };
//   }
// );
const adoptionSlice = createSlice({
  name: "AdoptionSlice",
  initialState: {
    web3: null,
    contract: null,
    address: null,
    pets: [],
    owner:"",
    allPets:[],
    isLoading: false,
    errorMessage: "",
    error: false,
  },
  reducers: {
    setAccount:(state, action)=>{
      state.address = action.payload
    }
  },
  extraReducers: {
    [mintPet.fulfilled]: (state, action) => {

    },
    [initWeb3.fulfilled]: (state, action) => {
      state.web3 = action.payload.web3;
      state.contract = action.payload.contract;
      state.address = action.payload.address;
      state.allPets = action.payload._pets;
      state.owner = action.payload.owner;
    },
    [getAdopters.fulfilled]: (state, action) => {
      state.pets = action.payload;
    },
    [adoptPet.fulfilled]: (state, action) => {
      // state.adopters[action.payload.petId] = action.payload.from;
      state.isLoading = false;
      state.error = false;
      state.errorMessage = "";
    },
   
    [adoptPet.pending]: (state, action) => {
      state.isLoading = true;
    },

    [adoptPet.rejected]: (state, action) => {
      state.errorMessage = action.error.message;
      state.error = true;
      state.isLoading = false;
    },
   
    // [unAdoptPet.rejected]: (state, action) => {
    //   state.errorMessage = action.error.message;
    //   state.error = true;
    //   state.isLoading = false;
    // },
    // [unAdoptPet.pending]: (state, action) => {
    //   state.isLoading = true;
    // },
    // [unAdoptPet.fulfilled]: (state, action) => {
    //   state.adopters[action.payload.petId] =
    //     "0x0000000000000000000000000000000000000000";
    //   state.isLoading = false;
    //   state.error = false;
    //   state.errorMessage = "";
    // },
  },
});

export const { setAccount } = adoptionSlice.actions;
export const adoptionReducer = adoptionSlice.reducer;
