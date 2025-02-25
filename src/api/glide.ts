import {
  addDoc,
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  Timestamp,
  QueryConstraint,
  where,
  onSnapshot,
} from "firebase/firestore";
// db
import { db } from "../db";
// types
import { Glide } from "../types/Glide";
import { User } from "../types/User";

const getGlides = async (
  loggedInUser: User,
  lastGlideCurrentlyLoaded: QueryDocumentSnapshot | null
) => {
  const _loggedInUsersGlides = doc(db, "users", loggedInUser.uid);
  const constraints: QueryConstraint[] = [orderBy("date", "desc"), limit(10)];

  // only display glides of users you follow, and your own
  if (loggedInUser.following.length > 0) {
    constraints.push(
      where("user", "in", [...loggedInUser.following, _loggedInUsersGlides])
    );
  } else {
    constraints.push(where("user", "==", _loggedInUsersGlides));
  }

  if (!!lastGlideCurrentlyLoaded) {
    constraints.push(startAfter(lastGlideCurrentlyLoaded));
  }

  const q = query(collection(db, "glides"), ...constraints);

  const qSnapshot = await getDocs(q);
  const _lastGlideCurrentlyLoaded = qSnapshot.docs[qSnapshot.docs.length - 1];

  const glides = await Promise.all(
    qSnapshot.docs.map(async (doc) => {
      const glide = doc.data() as Glide;
      const userSnapshot = await getDoc(glide.user as DocumentReference);
      glide.user = userSnapshot.data() as User;

      return { ...glide, id: doc.id };
    })
  );

  return { glides, lastGlideCurrentlyLoaded: _lastGlideCurrentlyLoaded };
};

// TODO: update to link renters to landlords
const subscribeToGlides = (loggedInUser: User) => {
  const _collection = collection(db, "glides");

  const constraints = [
    where("date", ">", Timestamp.now()),
    where("user", "in", loggedInUser.following),
  ];

  const q = query(_collection, ...constraints);

  return onSnapshot(q, (querySnapshot) => {
    console.log(querySnapshot.docs);
  });
};

const createGlide = async (form: {
  content: string;
  uid: string;
}): Promise<Glide> => {
  const userRef = doc(db, "users", form.uid);

  const glideToStore = {
    ...form,
    user: userRef,
    likesCount: 0,
    subglidesCount: 0,
    date: Timestamp.now(),
  };

  const glideCollection = collection(db, "glides");
  const added = await addDoc(glideCollection, glideToStore);

  return { ...glideToStore, id: added.id };
};

export { createGlide, getGlides, subscribeToGlides };
