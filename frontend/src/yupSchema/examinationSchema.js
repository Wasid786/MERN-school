import * as yup from 'yup'

export const examinationSchema = yup.object({
    date: yup.string().required("Date is required"),
    subject: yup.string().required("Subject is required"),
    examType: yup.string().required("ExamType is required"),

})