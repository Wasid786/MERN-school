import * as yup from 'yup'


export const ClassSchema = yup.object({
    class_text: yup.string().min(3,"Atleast 3 character is required").required("Class Text is Required."),
    class_num: yup.string().min(1,"Atleast 1 character is required").required("Class Number is Required"),
    

})