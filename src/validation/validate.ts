import * as yup from "yup"

export const RegisterEmployeeValidation = yup.object({
    name:yup.string().trim().required("name is required to register").min(3,"Name should be at least three characters"),
    email:yup.string().email("Fill the correct email").required("Email is required"),
    password:yup.string().trim().required("Password is required to register").min(8,"Password should have at least 8 characters"),
})

export type RegisterEmployeeType = yup.InferType<typeof RegisterEmployeeValidation>;

export const LoginEmployeerValidation = yup.object({
    email:yup.string().email("Email is incorrect").required("Email is required").defined(),
    password:yup.string().trim().min(8,"Password at least have 8 characters").defined(),
});

export type LoginEmployeerType = yup.InferType<typeof LoginEmployeerValidation>;

export const OnboardingCreationValidation = yup.object({
    name:yup.string().trim().required("name is required to register").min(3,"Name should be at least three characters"),
    email:yup.string().email("Fill the correct email").required("Email is required"),
});

export type OnboardingCreationType = yup.InferType<typeof OnboardingCreationValidation>;

export const DepartMentValidation = yup.object({
    name:yup.string().trim().required("name is required to register").min(3,"Name should be at least three characters"),
    description:yup.string().trim().required("name is required to register").min(3,"Name should be at least three characters"),
    status:yup.boolean().required("set the status true or false"),
});

export type DepartmentValidationType = yup.InferType<typeof DepartMentValidation>;

export const DepartUpdateValidation = yup.object({
  departmentManager:yup.string().required("Have to pass name to assign manager to department!").min(3,"Name should be at least three characters"),
})

export type DepartmentUpdateType = yup.InferType<typeof DepartUpdateValidation>;


export const EmployeeCreationValidation = yup.object({
  employeeId: yup
    .string()
    .trim()
    .required("Employee ID is required")
    .min(3, "Employee ID should be at least 3 characters"),

  name: yup
    .string()
    .trim()
    .required("Name is required")
    .min(3, "Name should be at least 3 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  phone: yup
    .string()
    .trim()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must contain 10 digits"),

  gender: yup
    .string()
    .oneOf(
      ["male", "female", "other"],
      "Please select a valid gender"
    )
    .required("Gender is required"),

  dob: yup
    .date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),

  address: yup
    .string()
    .trim()
    .required("Address is required")
    .min(10, "Address should be at least 10 characters"),

  designation: yup
    .string()
    .trim()
    .required("Designation is required")
    .min(2, "Designation should be at least 2 characters"),

  departmentId: yup
    .string()
    .trim()
    .required("Department is required"),

  role: yup
    .string()
    .oneOf(
      ["employee", "manager", "hr", "admin"],
      "Please select a valid role"
    )
    .required("Role is required"),

   status: yup
    .string()
    .oneOf(
      ["active", "probation"],
      "Please select a valid status"
    )
    .required("Status is required"),
});

export type EmployeeCreationType = yup.InferType<typeof EmployeeCreationValidation>;

export const EmployeeAssignTask = yup.object({
  managerId:yup.string().required("Have to pass name to assign manager to department!").min(3,"Name should be at least three characters"),
  teamId:yup.string().required("Have to pass name to assign team to department!").min(3,"Name should be at least three characters"),
  status: yup
  .string()
  .oneOf(
    [
      "active",
      "probation",
      "on_leave",
      "inactive",
      "resigned",
      "terminated",
    ],
    "Please select a valid employee status"
  )
  .required("Please select an employee status"),
})
export type EmployeeAssignTaskType = yup.InferType<typeof EmployeeAssignTask>;


export const EmployeeProfileUpdateSchema = yup.object({

  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),

  address: yup
    .string()
    .required("Address is required")
    .min(10, "Address should be at least 10 characters")
    .max(255, "Address cannot exceed 255 characters"),
});

export type EmployeeProfileUpdateType = yup.InferType<
  typeof EmployeeProfileUpdateSchema
>;


