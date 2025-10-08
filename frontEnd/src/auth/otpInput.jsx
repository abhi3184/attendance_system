import React from "react";
import OtpInput from "react-otp-input";

export default function OtpBox({ value, onChange }) {
  return (
    <div className="flex justify-center mt-4">
      <OtpInput
        value={value}
        onChange={onChange}
        numInputs={6}
        shouldAutoFocus
        inputStyle={{
          width: "2.8rem",
          height: "3rem",
          margin: "0 6px",
          fontSize: "1.4rem",
          borderRadius: "10px",
          border: "2px solid #d1d5db",
          backgroundColor: "#f9fafb",
          textAlign: "center",
          outline: "none",
          transition: "all 0.2s ease-in-out",
        }}
        focusStyle={{
          border: "2px solid #7e22ce",
          boxShadow: "0 0 6px rgba(126,34,206,0.4)",
          backgroundColor: "#fff",
        }}
        renderSeparator={<span> </span>}
        renderInput={(props) => <input {...props} />}
      />
    </div>
  );
}
