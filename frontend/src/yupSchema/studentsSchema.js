import * as yup from 'yup';

export const studentsSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  student_class: yup.string().required("Class is required"),
  age: yup.number().required("Age is required").positive().integer(),
  gender: yup.string().required("Gender is required"),
  guardian: yup.string().required("Guardian name is required"),
  guardian_phone: yup.string().required("Guardian phone is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  confirm_password: yup.string()
    .oneOf([yup.ref('password'), null], "Passwords must match")
    .required("Confirm Password is required"),
});