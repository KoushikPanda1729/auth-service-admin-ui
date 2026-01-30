import { combineReducers } from "@reduxjs/toolkit";
import loginReducer from "../modules/login/store/loginSlice";
import registerReducer from "../modules/register/store/registerSlice";
import usersReducer from "../modules/users/store/usersSlice";
import tenantsReducer from "../modules/tenants/store/tenantsSlice";
import categoriesReducer from "../modules/categories/store/categoriesSlice";
import productsReducer from "../modules/products/store/productsSlice";
import toppingsReducer from "../modules/toppings/store/toppingsSlice";
import ordersReducer from "../modules/orders/store/ordersSlice";

const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
  users: usersReducer,
  tenants: tenantsReducer,
  categories: categoriesReducer,
  products: productsReducer,
  toppings: toppingsReducer,
  orders: ordersReducer,
});

export default rootReducer;
