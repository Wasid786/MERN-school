import * as yup from 'yup'
export const registerSchema = yup.object({
    name: yup.string().min(8,"School name must contians 8 Characters.").required("School name is required"),
    email: yup.string().email("It must be an Email.").required("Email is Required."),
    owner_name:yup.string().min(3,"Owner name must have 3 Characters").required("It is required Field"),
    password: yup.string().min(8,"Password name must have 8 Characters").required("Password is required"),
    confirm_password:yup.string().oneOf([yup.ref('password')], "Confirm Password Must Match With Password").required("Confirm password Required")
    

})


