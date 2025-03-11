import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";
// types
import { AuthForm, RegisterForm } from "../types/Form";
import { User } from "../types/User";
// db
import { db, firebaseAuth } from "../db";

export type AuthType = "register" | "login";

const register = async (form: RegisterForm) => {
  const { user: registeredUser } = await createUserWithEmailAndPassword(
    firebaseAuth,
    form.email,
    form.password
  );

  const user: User = {
    uid: registeredUser.uid,
    fullName: form.fullName,
    userName: form.userName,
    email: form.email,
    avatar: form.avatar,
    followers: [],
    following: [],
    followersCount: 0,
    followingCount: 0,
    isLandlord: form.isLandlord,
    isRenter: form.isRenter,
  };

  await setDoc(doc(db, "users", registeredUser.uid), user);
  return registeredUser;
};

const login = async (loginForm: AuthForm) => {
  const { user } = await signInWithEmailAndPassword(
    firebaseAuth,
    loginForm.email,
    loginForm.password
  );
  return user;
};

const authenticate = (form: AuthForm, type: AuthType) => {
  return type === "login" ? login(form) : register(form as RegisterForm);
};

const logout = () => {
  return signOut(firebaseAuth);
};

const getUser = async (uid: string) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  return docSnap.data() as User;
};

export { register, logout, login, authenticate, getUser };
