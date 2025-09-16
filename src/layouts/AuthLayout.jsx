import React from "react";
import Inllustration from "../components/auth/Inllustration";
import LoginForm from "../components/auth/LoginForm";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex">
      <Inllustration />
      <LoginForm />
    </div>
  );
};

export default AuthLayout;
