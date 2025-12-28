import { combineReducers } from "@reduxjs/toolkit";
import loginReducer from "../modules/login/store/loginSlice";
import registerReducer from "../modules/register/store/registerSlice";
import usersReducer from "../modules/users/store/usersSlice";
import tenantsReducer from "../modules/tenants/store/tenantsSlice";

const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
  users: usersReducer,
  tenants: tenantsReducer,
});

export default rootReducer;
