import { combineReducers } from "@reduxjs/toolkit";
import loginReducer from "../modules/login/store/loginSlice";
import registerReducer from "../modules/register/store/registerSlice";

const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
});

export default rootReducer;
