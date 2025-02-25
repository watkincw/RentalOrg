import { createSignal, onMount } from "solid-js";
import { FirebaseError } from "firebase/app";
// types
import { User } from "../types/User";
// api
import { getUsers } from "../api/user";
// context
import { useUIDispatch } from "../context/ui";

const useUsers = () => {
  const { addSnackbar } = useUIDispatch();
  const [users, setUsers] = createSignal<User[]>([]);
  const [loading, setLoading] = createSignal(true);

  onMount(() => {
    loadUsers();
  });

  const loadUsers = async () => {
    try {
      const users = await getUsers();
      setUsers(users);
    } catch (error) {
      const message = (error as FirebaseError).message;
      addSnackbar({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    users,
  };
};

export default useUsers;
