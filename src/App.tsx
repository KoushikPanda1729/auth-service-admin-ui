import { useEffect } from "react";
import { AppRoutes } from "./routes";
import { useAppDispatch } from "./app/hooks";
import { fetchUser } from "./modules/login/store/loginSlice";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
