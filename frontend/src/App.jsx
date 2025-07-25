import {Route, Routes, BrowserRouter} from 'react-router-dom'
import './App.css'
import School from './school/School'
import Dashboard from './school/components/dashboard/Dashboard'
import Class from './school/components/class/Class'
import Examinations from './school/components/examinations/Examinations'
import Teachers from './school/components/teachers/Teachers'
import Notice from './school/components/notice/Notice'
import Students from './school/components/students/Students'
import Subjects from './school/components/subjects/Subjects'
import Client from './client/Client'
import Home from './client/components/home/Home'
import Login from './client/components/login/Login'
import Register from './client/components/register/Register'
import Teacher from './teacher/Teacher'
import TeacherDetails from './teacher/components/teacher details/TeacherDetails'
import ExaminationsTeacher from './teacher/components/examinations/ExaminationsTeacher'
import NoticeTeacher from './teacher/components/notice/NoticeTeacher'
import Student from './student/Student'
import StudentDetails from './student/components/student details/StudentDetails'
import AttendanceStudent from './student/components/attendance/AttendanceStudent'
import ExaminationsStudent from './student/components/examinations/ExaminationsStudent'
import NoticeStudent from './student/components/notice/NoticeStudent'
import AttendanceTeacher from './teacher/components/attendance/AttendanceTeacher'
import ProtectedRoute from './guard/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import AttendanceStudentList from './school/components/attendance/AttendanceStudentList'
import AttendanceDetails from './school/components/attendance/AttendanceDetails'
import LogOut from './client/components/logout/LogOut'




function App() {

  return (
    <>
    <AuthProvider> 

  
    <BrowserRouter>
      <Routes>
        {/* /// school routes // */}
        <Route path='school'element={<ProtectedRoute allowedRoles={['SCHOOL']}> <School/></ProtectedRoute>}>
        <Route index element={<Dashboard/>}/>

        <Route path='dashboard' element={<Dashboard/>} />
        <Route path='attendance' element={<AttendanceStudentList/>} />
        <Route path='attendance/:id' element={<AttendanceDetails/>} />

        <Route path='class' element={<Class/>} />
        <Route path='examinations' element={<Examinations/>} />
        <Route path='notice' element={<Notice/>} />
        <Route path='student' element={<Students/>} />
        <Route path='subject' element={<Subjects/>} />
        <Route path='teachers' element={<Teachers/>} />
        </Route>

        {/* ////// Student /////// */}
          <Route path="student" element={<ProtectedRoute allowedRoles={['STUDENT']}> <Student/></ProtectedRoute>}>

           <Route index element={<StudentDetails/>} />
         <Route path='attendance' element={<AttendanceStudent/>} />
         <Route path='examinations' element={<ExaminationsStudent/>} />
         <Route path='notice' element={<NoticeStudent/>} />
          
          </Route>

       {/* //// Teacher ////// */}
          <Route path="teacher" element={<ProtectedRoute allowedRoles={['TEACHER']}> <Teacher/></ProtectedRoute>}>

         <Route index element={<TeacherDetails/>} />
         <Route path='attendance' element={<AttendanceTeacher/>} />
         <Route path='examinations' element={<ExaminationsTeacher/>} />
         <Route path='notice' element={<NoticeTeacher/>} />
        </Route> 
       

          {/* //// Subjects ////// */}
          <Route path="subject" element={<ProtectedRoute allowedRoles={['SUBJECT']}> <Subjects/></ProtectedRoute>}>

       
        </Route> 

  {/* //// Client  ////// */}
         <Route path='/' element={<Client/>}>
         <Route index element={<Home/>} />
         <Route path='login' element={<Login/>} />
         <Route path='register' element={<Register/>} />
         <Route path='logout' element={<LogOut/>} />



        </Route> 

      </Routes>
    </BrowserRouter>
      </AuthProvider>
   
    </>
  )
}

export default App
