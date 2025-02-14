import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
// types
import { RegisterForm } from "../types/Form";
import { User } from "../types/User";
// db
import { db, firebaseAuth } from "../db";

const registerUser = async (form: RegisterForm) => {
  const { user: registeredUser } = await createUserWithEmailAndPassword(firebaseAuth, form.email, form.password);

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
  };

  await setDoc(doc(db, "users", registeredUser.uid), user);
  return registeredUser;
};

const logout = () => {
  return signOut(firebaseAuth);
};

export { registerUser, logout };
