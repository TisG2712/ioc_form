import React, { memo } from "react";
import FormManagementLayout from "../../layouts/FormManagementLayout";
import Header from "../../components/ui/Header";
import Navbar from "../../components/ui/Navbar";

const Form = memo(() => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <Navbar />
      <FormManagementLayout />
    </div>
  );
});

Form.displayName = "Form";

export default Form;
