import * as yup from 'yup'


export const subjectSchema = yup.object({
    subject_name: yup.string().min(3,"Atleast 3 character is required").required("Subject Name is Required."),
    subject_codename: yup.string().min(1,"Atleast 1 character is required").required("Subject Code name is Required"),
    

})