import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "../../assets/background.jpg";
import logo from "../../assets/logo.png";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrors(["Passwords do not match"]);
      return;
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/");
      } else {
        console.log(data.message);
        setErrors([
          data.message ||
            "An unexpected error occurred. Please try again later.",
        ]);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setErrors(["An unexpected error occurred. Please try again later."]);
    }
  };
  return (
    <div
      className="bg-cover bg-center h-screen"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-white h-screen bg-opacity-[.01] backdrop-filter backdrop-blur-lg p-10 flex justify-center items-center">
        <div className="bg-white rounded-md w-[476px] h-[676px] px-16 py-10 border border-opacity-85 border-[#117ACD] flex flex-col items-center">
          <section className="logo">
            <img className="h-20" src={logo} alt="logo" />
          </section>
          <section className="form mt-8 w-full">
            <form onSubmit={handleSubmit}>
              <div className="email-input font-rubik text-xs mb-10">
                <div className="label mb-2 flex">
                  <p className="font-rubik mr-1">NAME</p>
                  <p className="text-[#117ACD]">*</p>
                </div>
                <div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-2 border rounded-[5px] h-10 w-full"
                    required
                  />
                </div>
              </div>
              <div className="email-input font-rubik text-xs mb-10">
                <div className="label mb-2 flex">
                  <p className="font-rubik mr-1">EMAIL ADDRESS</p>
                  <p className="text-[#117ACD]">*</p>
                </div>
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="p-2 border rounded-[5px] h-10 w-full"
                    required
                  />
                </div>
              </div>
              <div className="password-input font-rubik text-xs mb-10">
                <div className="label mb-2 flex">
                  <p className="font-rubik mr-1">PASSWORD</p>
                  <p className="text-[#117ACD]">*</p>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="p-2 border rounded-[5px] h-10 w-full"
                    required
                  />
                  {showPassword ? (
                    <div
                      className="hover:cursor-pointer absolute top-2 right-2"
                      onClick={() => setShowPassword(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-eye-closed"
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#9e9e9e"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M21 9c-2.4 2.667 -5.4 4 -9 4c-3.6 0 -6.6 -1.333 -9 -4" />
                        <path d="M3 15l2.5 -3.8" />
                        <path d="M21 14.976l-2.492 -3.776" />
                        <path d="M9 17l.5 -4" />
                        <path d="M15 17l-.5 -4" />
                      </svg>
                    </div>
                  ) : (
                    <div
                      className="hover:cursor-pointer absolute top-2 right-2"
                      onClick={() => setShowPassword(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-eye"
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#9e9e9e"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                        <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <div className="password-input font-rubik text-xs mb-6">
                <div className="label mb-2 flex">
                  <p className="font-rubik mr-1">CONFIRM PASSWORD</p>
                  <p className="text-[#117ACD]">*</p>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="p-2 border rounded-[5px] h-10 w-full"
                    required
                  />
                  {showConfirmPassword ? (
                    <div
                      className="hover:cursor-pointer absolute top-2 right-2"
                      onClick={() => setShowConfirmPassword(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-eye-closed"
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#9e9e9e"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M21 9c-2.4 2.667 -5.4 4 -9 4c-3.6 0 -6.6 -1.333 -9 -4" />
                        <path d="M3 15l2.5 -3.8" />
                        <path d="M21 14.976l-2.492 -3.776" />
                        <path d="M9 17l.5 -4" />
                        <path d="M15 17l-.5 -4" />
                      </svg>
                    </div>
                  ) : (
                    <div
                      className="hover:cursor-pointer absolute top-2 right-2"
                      onClick={() => setShowPassword(true)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="icon icon-tabler icon-tabler-eye"
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="#9e9e9e"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                        <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              {errors.length > 0 && (
                <div className="errors text-red-500 text-xs text-center">
                  {errors.map((error, index) => (
                    <p key={index}>{error}</p>
                  ))}
                </div>
              )}
              <div className="flex justify-center mt-10">
                <button
                  type="submit"
                  className="bg-[#117ACD] text-white font-rubik py-2 px-4 w-1/2 rounded-md"
                >
                  Register
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Register;
