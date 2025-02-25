import { createSignal, onMount } from "solid-js";
import { FirebaseError } from "firebase/app";
// types
import { User } from "../types/User";
// api
import * as api from "../api/user";
// context
import { useUIDispatch } from "../context/ui";
import { useAuthState } from "../context/auth";

const useUsers = () => {
  const { user } = useAuthState()!;
  const { addSnackbar } = useUIDispatch();
  const [users, setUsers] = createSignal<User[]>([]);
  const [loading, setLoading] = createSignal(true);

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

  const followUser = async (followingUser: User) => {
    await api.followUser(user!.uid, followingUser.uid);
    alert("following done");
  };

  return {
    loading,
    users,
    followUser,
  };
};

export default useUsers;
