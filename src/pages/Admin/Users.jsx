import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_API_USERS_FETCH);
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        console.log("API Response:", data);
        if (data.users && Array.isArray(data.users)) {
          setUsers(data.users);
        } else {
          throw new Error("Received data.users is not an array");
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(import.meta.env.VITE_API_USER_DELETE, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
        setUsers(users.filter((user) => user.id !== userId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_USER_BLOCK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to block user");
      }

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, blocked: true } : user
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUnblockUser = async (userId) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_USER_UNBLOCK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to unblock user");
      }

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, blocked: false } : user
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDemote = async (userId) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_USER_DEMOTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to demote user");
      }

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: "user" } : user
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePromote = async (userId) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_USER_PROMOTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        throw new Error("Failed to promote user");
      }
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: "user" } : user
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1 className="font-rubik text-xl">Users</h1>
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Email</th>
            <th className="border border-gray-300 p-2">Role</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) ? (
            users.map((user) => (
              <tr key={user.id}>
                <td className="border border-gray-300 p-2">{user.id}</td>
                <td className="border border-gray-300 p-2">{user.name}</td>
                <td className="border border-gray-300 p-2">{user.email}</td>
                <td className="border border-gray-300 p-2">
                  {user.roleId === 1 ? "Admin" : "User"}
                </td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white rounded px-2 py-1 mr-2"
                  >
                    Delete
                  </button>
                  {user.blocked ? (
                    <button
                      onClick={() => handleUnblockUser(user.id)}
                      className="bg-green-500 text-white rounded px-2 py-1"
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlockUser(user.id)}
                      className="bg-yellow-500 text-white rounded px-2 py-1"
                    >
                      Block
                    </button>
                  )}
                  {user.roleId === 1 ? (
                    <button onClick={() => handlePromote(user.id)}>
                      Promote
                    </button>
                  ) : (
                    <button onClick={() => handleDemote(user.id)}>
                      Demote
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="border border-gray-300 p-2 text-center"
              >
                No users available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
