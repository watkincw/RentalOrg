import { createContext, onMount, ParentComponent, Show, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { useLocation, useNavigate } from "@solidjs/router";
import { onAuthStateChanged } from "firebase/auth";
// components/utils
import Loader from "../components/utils/Loader";
// db
import { firebaseAuth } from "../db";
// types
import { User } from "../types/User";
import { getUser } from "../api/auth";

type AuthStateContextValues = {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
};

type AuthDispatch = {
  updateUser: (u: Partial<User>) => void;
};

const initialState = () => ({
  isAuthenticated: false,
  loading: true,
  user: null,
});

const AuthStateContext = createContext<AuthStateContextValues>();
const AuthDispatchContext = createContext<AuthDispatch>();

const AuthProvider: ParentComponent = (props) => {
  const [store, setStore] = createStore<AuthStateContextValues>(initialState());
  const location = useLocation();
  const navigate = useNavigate();

  onMount(() => {
    setStore("loading", true);
    listenToAuthChanges();
  });

  const listenToAuthChanges = () => {
    onAuthStateChanged(firebaseAuth, async (user) => {
      if (!!user) {
        const rentalOrgUser = await getUser(user.uid);

        setStore("isAuthenticated", true);
        setStore("user", rentalOrgUser);

        if (location.pathname.includes("/auth")) {
          navigate("/", { replace: true });
        }
      } else {
        setStore("isAuthenticated", false);
        setStore("user", null);
      }

      setStore("loading", false);
    });
  };

  const updateUser = (user: Partial<User>) => {
    Object.keys(user).forEach((userKey) => {
      const key = userKey as keyof User; // "uid" | "username"
      setStore("user", key, user[key]!);
    });
  };

  return (
    <AuthStateContext.Provider value={store}>
      <AuthDispatchContext.Provider value={{ updateUser }}>
        <Show
          when={store.loading}
          fallback={props.children}
        >
          <Loader size={100} />
        </Show>
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

export const useAuthState = () => useContext(AuthStateContext);
export const useAuthDispatch = () => useContext(AuthDispatchContext);

export default AuthProvider;
