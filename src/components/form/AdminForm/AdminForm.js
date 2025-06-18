import clsx from "clsx";
import Image from "next/image";
import React from "react";
import FormHeader from "../FormHeader/FormHeader";

const AdminForm = () => {
  return (
    <div className={clsx("w-full bg-white p-6 flex flex-col poppins")}>
      <FormHeader title="Admin Application Form" />
      <form>{/* Admin form fields */}</form>
    </div>
  );
};

export default AdminForm;
