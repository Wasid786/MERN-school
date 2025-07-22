import * as yup from 'yup'


export const NoticeSchema = yup.object({
    title: yup.string().required("Title is Required."),
    message: yup.string().min(1,"Atleast 8 character is required").required("Notice is Required"),
    audience:yup.string().required("Audience is required field.")

})