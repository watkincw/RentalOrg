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
  setDoc,
} from "firebase/firestore";
// db
import { db } from "../db";
// types
import { Glide, UserGlide } from "../types/Glide";
import { User } from "../types/User";

const getGlideById = async (id: string, uid: string) => {
  const userDocRef = doc(db, "users", uid);
  const userGlideRef = doc(userDocRef, "glides", id);
  const userGlideSnap = await getDoc(userGlideRef);
  const userGlide = userGlideSnap.data() as UserGlide;

  const glideSnap = await getDoc(userGlide.lookup);
  const userDocSnap = await getDoc(userDocRef);

  const glide = {
    ...glideSnap.data(),
    user: userDocSnap.data(),
    id: glideSnap.id,
    lookup: glideSnap.ref.path,
  } as Glide;

  return glide;
};

const getGlides = async (
  loggedInUser: User,
  lastGlideCurrentlyLoaded: QueryDocumentSnapshot | null
) => {
  const _loggedInUsersGlides = doc(db, "users", loggedInUser.uid);
  const constraints: QueryConstraint[] = [orderBy("date", "desc"), limit(10)];

  // only display glides of users you follow, and your own
  if (loggedInUser.following.length > 0) {
    constraints.push(where("user", "in", [...loggedInUser.following, _loggedInUsersGlides]));
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
      const userSnap = await getDoc(glide.user as DocumentReference);
      glide.user = userSnap.data() as User;

      return { ...glide, id: doc.id, lookup: doc.ref.path };
    })
  );

  return { glides, lastGlideCurrentlyLoaded: _lastGlideCurrentlyLoaded };
};

const getSubgldies = async (glideLookup: string) => {
  const ref = doc(db, glideLookup);
  const _collection = collection(ref, "glides");

  const constraints = [orderBy("date", "desc"), limit(10)];

  const q = query(_collection, ...constraints);

  const qSnapshot = await getDocs(q);
  const glides = await Promise.all(
    qSnapshot.docs.map(async (doc) => {
      const glide = doc.data() as Glide;
      const userSnap = await getDoc(glide.user as DocumentReference);
      glide.user = userSnap.data() as User;

      return { ...glide, id: doc.id, lookup: doc.ref.path };
    })
  );

  return {
    glides,
    lastGlideCurrentlyLoaded: null,
  };
};

// TODO: update to link renters to landlords
const subscribeToGlides = (loggedInUser: User, getCallback: (g: Glide[]) => void) => {
  const _collection = collection(db, "glides");

  const constraints = [
    where("date", ">", Timestamp.now()),
    where("user", "in", loggedInUser.following),
  ];

  const q = query(_collection, ...constraints);

  return onSnapshot(q, async (querySnapshot) => {
    const glides = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const glide = doc.data() as Glide;
        const userSnap = await getDoc(glide.user as DocumentReference);
        glide.user = userSnap.data() as User;

        return { ...glide, id: doc.id };
      })
    );

    getCallback(glides);
  });
};

const createGlide = async (
  form: { content: string; uid: string },
  replyTo?: string
): Promise<Glide> => {
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

  const userGlideRef = doc(userRef, "glides", added.id);
  await setDoc(userGlideRef, { lookup: added });

  return { ...glideToStore, id: added.id, lookup: added.path };
};

export { createGlide, getGlides, subscribeToGlides, getGlideById, getSubgldies };
