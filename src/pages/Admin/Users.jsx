import React, { useEffect, useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert
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
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(import.meta.env.VITE_API_USER_DELETE, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: [userId] }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }
        setUsers(users.filter((user) => user.id !== userId));
        Swal.fire(
          'Deleted!',
          'User has been deleted.',
          'success'
        );
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleBlockUser = async (userId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to block this user?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, block it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(import.meta.env.VITE_API_USER_BLOCK, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: [userId] }),
        });

        if (!response.ok) {
          throw new Error("Failed to block user");
        }

        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, blocked: true } : user
          )
        );
        Swal.fire(
          'Blocked!',
          'User has been blocked.',
          'success'
        );
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleUnblockUser = async (userId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to unblock this user?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, unblock it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(import.meta.env.VITE_API_USER_UNBLOCK, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: [userId] }),
        });

        if (!response.ok) {
          throw new Error("Failed to unblock user");
        }

        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, blocked: false } : user
          )
        );
        Swal.fire(
          'Unblocked!',
          'User has been unblocked.',
          'success'
        );
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handlePromote = async (userId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to promote this user?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, promote it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(import.meta.env.VITE_API_USER_PROMOTE, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: userId }),
        });

        if (!response.ok) {
          throw new Error("Failed to promote user");
        }
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: "admin" } : user
          )
        );
        Swal.fire(
          'Promoted!',
          'User has been promoted.',
          'success'
        );
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleDemote = async (userId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to demote this user?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, demote it!'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(import.meta.env.VITE_API_USER_DEMOTE, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: userId }),
        });

        if (!response.ok) {
          throw new Error("Failed to demote user");
        }
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: "user" } : user
          )
        );
        Swal.fire(
          'Demoted!',
          'User has been demoted.',
          'success'
        );
      } catch (error) {
        setError(error.message);
      }
    }
  };

  return (
    <div>
      <h1 className="font-rubik text-xl">Users</h1>
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full mt-4 bg-white shadow-md rounded-lg overflow-hidden dark:bg-gray-800">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="border-b border-gray-300 p-4 text-left text-gray-600 dark:text-gray-300">
              ID
            </th>
            <th className="border-b border-gray-300 p-4 text-left text-gray-600 dark:text-gray-300">
              Name
            </th>
            <th className="border-b border-gray-300 p-4 text-left text-gray-600 dark:text-gray-300">
              Email
            </th>
            <th className="border-b border-gray-300 p-4 text-left text-gray-600 dark:text-gray-300">
              Role
            </th>
            <th className="border-b border-gray-300 p-4 text-left text-gray-600 dark:text-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) ? (
            users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="border-b border-gray-300 p-4 dark:border-gray-600">
                  {user.id}
                </td>
                <td className="border-b border-gray-300 p-4 dark:border-gray-600">
                  {user.name}
                </td>
                <td className="border-b border-gray-300 p-4 dark:border-gray-600">
                  {user.email}
                </td>
                <td className="border-b border-gray-300 p-4 dark:border-gray-600">
                  {user.roleId === 1 ? "Admin" : "User"}
                </td>
                <td className="border-b border-gray-300 p-4 dark:border-gray-600 flex space-x-2">
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white rounded px-3 py-1 hover:bg-red-600 transition-colors duration-200"
                  >
                    Delete
                  </button>
                  {user.blocked ? (
                    <button
                      onClick={() => handleUnblockUser(user.id)}
                      className="bg-green-500 text-white rounded px-3 py-1 hover:bg-green-600 transition-colors duration-200"
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlockUser(user.id)}
                      className="bg-gray-500 text-white rounded px-3 py-1 hover:bg-gray-600 transition-colors duration-200"
                    >
                      Block
                    </button>
                  )}
                  {user.roleId === 2 ? (
                    <button
                      onClick={() => handlePromote(user.id)}
                      className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600 transition-colors duration-200"
                    >
                      Promote
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDemote(user.id)}
                      className="bg-yellow-500 text-white rounded px-3 py-1 hover:bg-yellow-600 transition-colors duration-200"
                    >
                      Demote
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No users available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
