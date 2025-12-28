import { combineReducers } from "@reduxjs/toolkit";
import loginReducer from "../modules/login/store/loginSlice";
import registerReducer from "../modules/register/store/registerSlice";
import usersReducer from "../modules/users/store/usersSlice";

const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
  users: usersReducer,
});

export default rootReducer;
