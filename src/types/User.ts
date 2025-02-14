import { DocumentReference } from "firebase/firestore";

export interface User {
  uid: string;
  fullName: string;
  nickName: string;
  avatar: string;
  followers: DocumentReference[];
  following: DocumentReference[];
  followersCount: number;
  follingCount: number;
}
