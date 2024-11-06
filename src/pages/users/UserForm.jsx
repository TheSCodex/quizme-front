import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function UserForm() {
  const location = useLocation();
  const userId = location.state?.userId;
  const userData = location.state?.userData || {};
  const [formValues, setFormValues] = useState({
    name: userData.name || "",
    email: userData.email || "",
    password: "",
    theme: userData.theme || "light",
  });
  let navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(import.meta.env.VITE_API_USER_UPDATE, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: userId, ...formValues }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }
      const updatedUser = await response.json();
      const existingToken =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      if (existingToken) {
        if (localStorage.getItem("authToken")) {
          localStorage.setItem("authToken", updatedUser.token);
        } else {
          sessionStorage.setItem("authToken", updatedUser.token);
        }
      } else {
        sessionStorage.setItem("authToken", updatedUser.token);
      }
      Swal.fire({
        icon: "success",
        title: "User updated successfully",
        text: "The user information has been updated.",
        confirmButtonText: "OK",
      });
      navigate(-1);
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: "An error occurred while updating user information.",
        confirmButtonText: "Try Again",
      });
    }
  };

  const handleSalesforceIntegration = async () => {
    try {
      const salesforceInstanceUrl = "https://arvaz-dev-ed.develop.my.salesforce.com";
      const accessToken = import.meta.env.VITE_SALESFORCE_TOKEN;
      const encodedAccessToken = encodeURIComponent(accessToken);
      const accountData = {
        Name: formValues.name,
      };
      const accountResponse = await fetch(
        `${salesforceInstanceUrl}/services/data/v62.0/sobjects/Account/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(accountData),
        }
      );
      if (!accountResponse.ok) {
        throw new Error("Failed to create Account in Salesforce");
      }
      const account = await accountResponse.json();
      const accountId = account.id;
      const contactData = {
        LastName: formValues.name,
        Email: formValues.email,
        AccountId: accountId,
      };
      const contactResponse = await fetch(
        `${salesforceInstanceUrl}/services/data/v62.0/sobjects/Contact/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactData),
        }
      );
      if (!contactResponse.ok) {
        throw new Error("Failed to create Contact in Salesforce");
      }
      Swal.fire({
        icon: "success",
        title: "Salesforce Integration Successful",
        text: "User information has been sent to Salesforce.",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Error integrating with Salesforce:", error);
      Swal.fire({
        icon: "error",
        title: "Salesforce Integration Failed",
        text: "An error occurred while sending data to Salesforce.",
        confirmButtonText: "Try Again",
      });
    }
  };

  const handleCancel = () => {
    setFormValues({
      name: userData.name || "",
      email: userData.email || "",
      password: "",
      theme: userData.theme || "light",
    });
    navigate(-1);
  };

  return (
    <div>
      <p className="font-rubik text-lg md:text-xl">User Info</p>
      <form
        onSubmit={handleSubmit}
        className="w-full mt-6 bg-white dark:bg-[#1f2937] rounded-md shadow-md p-4 md:p-8 grid grid-cols-1 gap-4"
      >
        <input
          type="text"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          className="border p-2 rounded dark:bg-[#374151] border-black/15"
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          className="border p-2 rounded dark:bg-[#374151] border-black/15"
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          className="border p-2 rounded dark:bg-[#374151] border-black/15"
          placeholder="New Password"
        />
        <select
          name="theme"
          value={formValues.theme}
          onChange={handleChange}
          className="border p-2 rounded dark:bg-[#374151] border-black/15"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <div className="flex justify-end gap-4 mt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-md border-black/15"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md border-black/15"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleSalesforceIntegration}
            className="px-4 py-2 bg-green-500 text-white rounded-md border-black/15"
          >
            Send to Salesforce
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;
