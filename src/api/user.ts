import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
// db
import { db } from "../db";
// types
import { User } from "../types/User";

const getUsers = async (loggedInUser: User) => {
  const q = query(
    collection(db, "users"),
    where("uid", "!=", loggedInUser.uid)
  );
  const querySnapshot = await getDocs(q);

  const users = querySnapshot.docs.map((doc) => {
    const user = doc.data() as User;
    return user;
  });

  return users;
};

const followUser = async (followerUid: string, followingUid: string) => {
  const followerRef = doc(db, "users", followerUid);
  const followingRef = doc(db, "users", followingUid);

  await updateDoc(followerRef, {
    following: arrayUnion(followingRef),
    followingCount: increment(1),
  });

  await updateDoc(followingRef, {
    followers: arrayUnion(followerRef),
    followersCount: increment(1),
  });

  return followingRef;
};



export { getUsers, followUser };
