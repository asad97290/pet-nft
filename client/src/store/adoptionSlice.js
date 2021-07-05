import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Web3 from "web3";
import Adoption from "../contracts/PetShop.json";
import axios from "axios";
export const initWeb3 = createAsyncThunk("InitWeb3", async () => {
  try {
    if (Web3.givenProvider) {
      const web3 = new Web3(Web3.givenProvider);
      await Web3.givenProvider.enable();
      const networkId = await web3.eth.net.getId();
      
      if(networkId !== 4){
        alert("plz select Rinkeby test network")
        return;
      }
      const contract = new web3.eth.Contract(
        Adoption.abi,
        Adoption.networks[networkId].address
      );
      const addresses = await web3.eth.getAccounts();
      let numberOfPets = await contract.methods.totalSupply().call();
      
      let owner = await contract.methods.owner().call()
      let _pets = []
      for(let i=1;i<=numberOfPets;i++){
        console.log("inside for loop")
        // let tokens = await contract.methods.tokenByIndex(i-1).call();
        let tokenOwner = await contract.methods.ownerOf(i).call();
        let adoptersArray = await contract.methods.tokenURI(i).call();
        let {data} = await axios.get(adoptersArray)
       
          _pets.push({data,tokenOwner,uri:adoptersArray})        
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
    console.log("Error:",e);
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
        let tokenIndex = await contract.methods.tokenOfOwnerByIndex(address,i-1).call();
        let adoptersArray = await contract.methods.tokenURI(tokenIndex).call();
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
    let result = await contract.methods.buyPetNft(data.petId).send({ from:address, value: web3.utils.toWei(data.petPrice,"ether")});

    return { from: result.from };
  }
);
export const mintPet = createAsyncThunk(
  "MintPet",
  async (data, thunkAPI) => {
    const { contract, address } = thunkAPI.getState().adoptionReducer;
    let result = await contract.methods.mintPetNft(data.petURI,data.petPrice).send({ from: address});

    return { from: result.from };
  }
);

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
      state.isLoading = false;
      state.error = false;
      state.errorMessage = "";
    },
    [mintPet.pending]: (state, action) => {
      state.isLoading = true;
    },

    [mintPet.rejected]: (state, action) => {
      state.errorMessage = action.error.message;
      state.error = true;
      state.isLoading = false;
    },
    [initWeb3.fulfilled]: (state, action) => {
      
      state.web3 = action.payload.web3;
      state.contract = action.payload.contract;
      state.address = action.payload.address;
      state.allPets = action.payload._pets;
      state.owner = action.payload.owner;
      state.isLoading = false;
      state.error = false;
      state.errorMessage = "";
    },
    [initWeb3.pending]: (state, action) => {
      state.isLoading = true;
    },

    [initWeb3.rejected]: (state, action) => {
      state.errorMessage = action.error.message;
      state.error = true;
      state.isLoading = false;
    },
    [getAdopters.fulfilled]: (state, action) => {
      state.pets = action.payload;
      state.isLoading = false;
      state.error = false;
      state.errorMessage = "";
    },
    [getAdopters.pending]: (state, action) => {
      state.isLoading = true;
    },

    [getAdopters.rejected]: (state, action) => {
      state.errorMessage = action.error.message;
      state.error = true;
      state.isLoading = false;
    },
    [adoptPet.fulfilled]: (state, action) => {
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
 
  },
});

export const { setAccount } = adoptionSlice.actions;
export const adoptionReducer = adoptionSlice.reducer;
