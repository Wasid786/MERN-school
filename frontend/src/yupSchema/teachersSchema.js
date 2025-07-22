import * as yup from 'yup';

export const teachersSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  age: yup.number().required("Age is required").positive().integer(),
  gender: yup.string().required("Gender is required"),
qualification: yup.string().required("Qualification is required"),
phone: yup.string().required("Phone is required"),

  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  confirm_password: yup.string()
    .oneOf([yup.ref('password'), null], "Passwords must match")
    .required("Confirm Password is required"),
});



export const teacherEditSchema = yup.object().shape({
   name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  age: yup.number().required("Age is required").positive().integer(),
  gender: yup.string().required("Gender is required"),
qualification: yup.string().required("Qualification is required"),
phone: yup.string().required("Qualification is required"),

  password: yup.string().min(6, "Password must be at least 6 characters"),
  confirm_password: yup.string()
    .oneOf([yup.ref('password'), null], "Passwords must match")
   
});