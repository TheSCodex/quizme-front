import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import background from "../../assets/background.jpg";
import logo from "../../assets/logo.png";

function Recover() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", ""]);
  const [emailSent, setEmailSent] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (emailSent && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [emailSent, countdown]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(import.meta.env.VITE_API_RECOVER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmailSent(true);
        setSuccessMessage("Email sent! Please enter the recovery code.");
        setCountdown(30);
        setCanResend(false);
      } else {
        setErrors([
          data.message ||
            "An unexpected error occurred. Please try again later.",
        ]);
      }
    } catch (error) {
      console.error("Error sending recovery email:", error);
      setErrors(["An unexpected error occurred. Please try again later."]);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    console.log(email);
    const recoveryCode = code.join("");
    try {
      const response = await fetch(import.meta.env.VITE_API_VALIDATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, recovery_code: recoveryCode })
    });

      const data = await response.json();

      if (response.ok) {
        navigate("/reset", { state: { email } });
      } else {
        setErrors([
          data.message ||
            "Invalid code. Please try again.",
        ]);
      }
    } catch (error) {
      console.error("Error validating recovery code:", error);
      setErrors(["An unexpected error occurred. Please try again later."]);
    }
  };

  const handleCodeChange = (e, index) => {
    const newCode = [...code];
    newCode[index] = e.target.value;
    setCode(newCode);
  };

  const handleResendCode = async () => {
    if (canResend) {
      try {
        const response = await fetch(import.meta.env.VITE_API_RECOVER, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccessMessage("New recovery code sent! Please check your email.");
          setCountdown(30);
          setCanResend(false);
        } else {
          setErrors([
            data.message ||
              "An unexpected error occurred. Please try again later.",
          ]);
        }
      } catch (error) {
        console.error("Error resending recovery code:", error);
        setErrors(["An unexpected error occurred. Please try again later."]);
      }
    }
  };

  return (
    <div
      className="bg-cover bg-center h-screen"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="bg-white h-screen bg-opacity-[.01] backdrop-filter backdrop-blur-lg p-10 flex justify-center items-center">
        <div className="bg-white rounded-md w-[476px] h-auto px-16 py-10 border border-opacity-85 border-[#117ACD] flex flex-col items-center">
          <section className="logo">
            <img className="h-20" src={logo} alt="logo" />
          </section>
          <section className="form mt-8 w-full">
            {!emailSent ? (
              <form onSubmit={handleEmailSubmit}>
                <p className="mb-6 text-xs font-rubik text-center">
                  Type in the email address you used to create your account, if it
                  matches an email in our records we’ll send you an email with
                  further instructions.
                </p>
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
                {errors.length > 0 && (
                  <div className="errors mt-4 text-red-500 text-xs text-center">
                    {errors.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}</div>
                )}
                <div className="flex justify-center mt-12">
                  <button
                    type="submit"
                    className="bg-[#117ACD] text-white font-rubik py-2 px-4 w-1/2 rounded-md"
                  >
                    Send Code
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCodeSubmit}>
                <p className="mb-6 text-xs font-rubik text-center">
                  {successMessage}
                </p>
                <div className="flex space-x-2 justify-center mb-6">
                  {code.map((value, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={value}
                      onChange={(e) => handleCodeChange(e, index)}
                      className="p-2 border rounded-[5px] h-10 w-10 text-center"
                    />
                  ))}
                </div>
                {errors.length > 0 && (
                  <div className="errors mt-4 text-red-500 text-xs text-center">
                    {errors.map((error, index) => (
                      <p key={index}>{error}</p>
                    ))}</div>
                )}
                <div className="flex justify-center mt-12">
                  <button
                    type="submit"
                    className="bg-[#117ACD] text-white font-rubik py-2 px-4 w-1/2 rounded-md"
                  >
                    Validate
                  </button>
                </div>

                <div className="text-center mt-6">
                  {canResend ? (
                    <button
                      onClick={handleResendCode}
                      className="text-[#117ACD] text-sm"
                    >
                      Resend code
                    </button>
                  ) : (
                    <p className="text-sm">
                      Didn&apos;t receive it? You may request another in {countdown} seconds.
                    </p>
                  )}
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Recover;
