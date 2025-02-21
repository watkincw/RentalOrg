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
} from "firebase/firestore";
// db
import { db } from "../db";
// types
import { Glide } from "../types/Glide";
import { User } from "../types/User";

const getGlides = async (
  lastGlideCurrentlyLoaded: QueryDocumentSnapshot | null
) => {
  const constraints: QueryConstraint[] = [orderBy("date", "desc"), limit(10)];

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

export { createGlide, getGlides };
