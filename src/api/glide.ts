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
  updateDoc,
  increment,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
// db
import { db } from "../db";
// types
import { Glide, UserGlide } from "../types/Glide";
import { User } from "../types/User";
import { UploadImage } from "../types/Form";

const uploadImage = async (image: UploadImage) => {
  const storage = getStorage();
  const storageRef = ref(storage, image.name);

  const uploadResult = await uploadBytes(storageRef, image.buffer);

  const downloadUrl = await getDownloadURL(uploadResult.ref);
  return downloadUrl;
};

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

const getSubgldies = async (
  glideLookup: string,
  lastGlideCurrentlyLoaded: QueryDocumentSnapshot | null
) => {
  const ref = doc(db, glideLookup);
  const _collection = collection(ref, "glides");

  // if user is replying to a glide, orderBy("date", "asc")
  const constraints: QueryConstraint[] = [orderBy("date", "desc"), limit(10)];

  if (!!lastGlideCurrentlyLoaded) {
    constraints.push(startAfter(lastGlideCurrentlyLoaded));
  }

  const q = query(_collection, ...constraints);

  const qSnapshot = await getDocs(q);
  const _lastGlideCurrentlyLoaded = qSnapshot.docs[qSnapshot.docs.length - 1];

  const glides = await Promise.all(
    qSnapshot.docs
      .map(async (doc) => {
        const glide = doc.data() as Glide;
        const userSnap = await getDoc(glide.user as DocumentReference);
        glide.user = userSnap.data() as User;

        return { ...glide, id: doc.id, lookup: doc.ref.path };
      })
      .reverse()
  );

  return {
    glides,
    lastGlideCurrentlyLoaded: _lastGlideCurrentlyLoaded,
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

const getGlideCollection = (replyTo?: string) => {
  let glideCollection;

  if (!!replyTo) {
    const ref = doc(db, replyTo);
    glideCollection = collection(ref, "glides");
  } else {
    glideCollection = collection(db, "glides");
  }

  return glideCollection;
};

const createGlide = async (
  form: { content: string; uid: string },
  replyTo?: string
): Promise<Glide> => {
  const userRef = doc(db, "users", form.uid);
  const glideCollection = getGlideCollection(replyTo);

  const glideToStore = {
    ...form,
    user: userRef,
    likesCount: 0,
    subglidesCount: 0,
    date: Timestamp.now(),
  };

  if (!!replyTo) {
    const ref = doc(db, replyTo);
    await updateDoc(ref, { subglidesCount: increment(1) });
  }

  const added = await addDoc(glideCollection, glideToStore);

  const userGlideRef = doc(userRef, "glides", added.id);
  await setDoc(userGlideRef, { lookup: added });

  return { ...glideToStore, id: added.id, lookup: added.path };
};

export { createGlide, getGlides, subscribeToGlides, getGlideById, getSubgldies, uploadImage };
