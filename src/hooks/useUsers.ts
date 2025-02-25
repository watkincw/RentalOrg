import { createSignal, onMount } from "solid-js";
import { FirebaseError } from "firebase/app";
// types
import { User } from "../types/User";
// api
import * as api from "../api/user";
// context
import { useUIDispatch } from "../context/ui";
import { useAuthDispatch, useAuthState } from "../context/auth";

const useUsers = () => {
  const { user } = useAuthState()!;
  const { updateUser } = useAuthDispatch()!;
  const { addSnackbar } = useUIDispatch();
  const [users, setUsers] = createSignal<User[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [loadingFollow, setLoadingFollow] = createSignal(false);

  onMount(() => {
    loadUsers();
  });

  const loadUsers = async () => {
    try {
      const users = await api.getUsers(user!);
      setUsers(users);
    } catch (error) {
      const message = (error as FirebaseError).message;
      addSnackbar({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // TODO: update followUser to keep track of renterCount instead of followers
  const followUser = async (followingUser: User) => {
    setLoadingFollow(true);

    try {
      const followingRef = await api.followUser(user!.uid, followingUser.uid);

      if (!user) throw new Error("You are not authenticated!");

      updateUser({
        following: [followingRef, ...user.following],
        followingCount: user.followingCount + 1,
      });
      addSnackbar({
        message: `Now following ${followingUser.userName}`,
        type: "success",
      });
    } catch (error) {
      const message = (error as FirebaseError).message;
      addSnackbar({ message, type: "error" });
    } finally {
      setLoadingFollow(false);
    }
  };

  return {
    loading,
    users,
    followUser,
    loadingFollow,
  };
};

export default useUsers;
