import { DocumentReference } from "firebase/firestore";

export interface User {
  uid: string;
  fullName: string;
  userName: string;
  email: string;
  avatar: string;
  followers: DocumentReference[];
  followersCount: number;
  following: DocumentReference[];
  followingCount: number;
  isLandlord?: boolean;
  isRenter?: boolean;
}
