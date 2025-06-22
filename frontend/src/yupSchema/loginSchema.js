import * as yup from 'yup'


export const loginSchema = yup.object({
    email: yup.string().email("It must be an Email.").required("Email is Required."),
    password: yup.string().min(8,"Password name must have 8 Characters").required("Password is required"),
    

})