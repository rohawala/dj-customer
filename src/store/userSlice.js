import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  
isVerified:false,
  userId: "",
  username: "",
  user_type: "",
  token:"",
  phoneNumber:"",
  isVerified:false,
  
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const {isVerified,userId,username,user_type,token,phoneNumber} = action.payload;
      state.isVerified=isVerified
      state.userId=userId
      state.username=username
      state.user_type=user_type
      state.token=token
      state.phoneNumber=phoneNumber
    },
    resetUser: (state) => {
      state.isVerified=false
      state.userId=""
      state.username=""
      state.user_type=""
      state.token=""
      state.phoneNumber=""

    },
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
