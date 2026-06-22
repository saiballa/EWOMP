import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { database,DATABASE_ID,EMPLOYEE_LIST,BUCKET_ID,ID,storage } from "../../../utils/appwrite";
import {
  EmployeeProfileUpdateSchema,
  type EmployeeProfileUpdateType,
} from "../../validation/validate";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const EmployeeProfileUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  console.log(id);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeProfileUpdateType>({
    defaultValues: {
      address: "",
      phone: "",
    },
    resolver: yupResolver(EmployeeProfileUpdateSchema),
    mode: "onChange",
  });

  const mutation = useMutation({
    mutationFn:async(data:EmployeeProfileUpdateType)=>{
        if(!selectedFile || !id)return;
        
        const response = await storage.createFile(BUCKET_ID,ID.unique(),selectedFile);

        await database.updateDocument(DATABASE_ID,EMPLOYEE_LIST,id,{
            profilePic:response?.$id,
            address:data?.address,
            phone:data?.phone,
        });
       
    },
    onSuccess:()=>{
        reset();
        toast.success("Employee details are updated successfully");
        navigate("/dashboard/profile");
    },
    onError:(error:any)=>{
        toast.error(error?.message || "Employee details are not updated,Something went wrong!");
    }

  })

  const onSubmit: SubmitHandler<EmployeeProfileUpdateType> = async (
    data: EmployeeProfileUpdateType,
  ) => {
    mutation.mutate(data);
  };
  return (
      <>
        <div className="mx-auto max-w-3xl px-3 sm:px-4 md:px-6 py-6 sm:py-10">

  <div className="rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-6 md:p-8 shadow-sm">

    {/* Header */}
    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
      Update Profile
    </h1>

    <p className="mt-2 text-sm text-slate-500">
      Update your profile picture, contact information, and address.
    </p>

    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 sm:mt-8 space-y-5 sm:space-y-6">

      {/* Profile Picture */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Profile Picture
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="
            w-full
            text-sm
            text-slate-600

            file:mr-3 sm:file:mr-4
            file:rounded-lg sm:file:rounded-xl
            file:border-0
            file:bg-slate-900
            file:px-3 sm:file:px-4
            file:py-2
            file:text-xs sm:file:text-sm
            file:font-medium
            file:text-white
            file:transition
            hover:file:bg-slate-800

            border border-slate-300
            rounded-lg sm:rounded-xl
            p-2
          "
        />
      </div>

      {/* Phone */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Phone Number
        </label>

        <input
          type="text"
          placeholder="Enter phone number"
          {...register("phone")}
          className="
            w-full
            rounded-lg sm:rounded-xl
            border border-slate-300
            px-3 sm:px-4
            py-2.5 sm:py-3
            text-sm sm:text-base
            outline-none
            transition
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-100
          "
        />

        {errors.phone?.message && (
          <p className="mt-2 text-xs sm:text-sm text-red-500">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Address */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Address
        </label>

        <textarea
          rows={4}
          placeholder="Enter address"
          {...register("address")}
          className="
            w-full
            rounded-lg sm:rounded-xl
            border border-slate-300
            px-3 sm:px-4
            py-2.5 sm:py-3
            text-sm sm:text-base
            outline-none
            transition
            focus:border-blue-500
            focus:ring-4
            focus:ring-blue-100
          "
        />

        {errors.address?.message && (
          <p className="mt-2 text-xs sm:text-sm text-red-500">
            {errors.address.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="
          w-full
          rounded-lg sm:rounded-xl
          bg-blue-600
          py-3
          text-sm sm:text-base
          font-medium
          text-white
          transition
          hover:bg-blue-700
          disabled:cursor-not-allowed
          disabled:bg-blue-400
        "
      >
        {mutation?.isPending ? "Updating Profile..." : "Update Profile"}
      </button>

    </form>
  </div>
</div>
      </>
    );
};
export default EmployeeProfileUpdatePage;
