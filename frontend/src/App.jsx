import {Route, Routes, BrowserRouter} from 'react-router-dom'
import './App.css'
import School from './school/School'
import Attendance from './school/components/attendance/Attendance'
import Dashboard from './school/components/dashboard/Dashboard'
import Schedule from './school/components/schedule/Schedule'
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
import ScheduleTeacher from './teacher/components/schedule/ScheduleTeacher'
import ExaminationsTeacher from './teacher/components/examinations/ExaminationsTeacher'
import NoticeTeacher from './teacher/components/notice/NoticeTeacher'
import Student from './student/Student'
import StudentDetails from './student/components/student details/StudentDetails'
import ScheduleStudent from './student/components/schedule/ScheduleStudent'
import AttendanceStudent from './student/components/attendance/AttendanceStudent'
import ExaminationsStudent from './student/components/examinations/ExaminationsStudent'
import NoticeStudent from './student/components/notice/NoticeStudent'
import AttendaceTeacher from './teacher/components/attendance/AttendaceTeacher'



function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        {/* /// school routes // */}
        <Route path='school' element={<School/>}>   
        {/* <Route path='school'element={<ProtectedRoute allowedRoles={['SCHOOL']}> <School/></ProtectedRoute>}> */}
        <Route index element={<Dashboard/>}/>

        <Route path='dashboard' element={<Dashboard/>} />
        <Route path='attendance' element={<Attendance/>} />
        <Route path='class' element={<Class/>} />
        <Route path='examinations' element={<Examinations/>} />
        <Route path='notice' element={<Notice/>} />
        <Route path='schedule' element={<Schedule/>} />
        <Route path='students' element={<Students/>} />
        <Route path='subjects' element={<Subjects/>} />
        <Route path='teachers' element={<Teachers/>} />

        {/* <Route path='class-details' element={<ClassDetails/>} />
        <Route path='assign-period' element={<AssignPeriod/>} />
        <Route path='periods' element={<Schedule/>} />
        <Route path='attendance-student/:studentId' element={<AttendanceDetails/>} /> */}
        </Route>

        {/* ////// Student /////// */}
       {/* <Route path="student" element={<ProtectedRoute allowedRoles={['STUDENT']}> <Student/></ProtectedRoute>}>
       <Route index element={<StudentDetails/>}/>
       <Route path="student-details"element={<StudentDetails/>}/>
       <Route path="examinations"element={<StudentExaminatons/>}/>
       <Route path="periods"element={<ScheduleStudent/>}/>
       <Route path="attendance"element={<AttendanceStudent/>}/>
       <Route path="notice"element={<NoticeStudent/>}/>
       
        </Route> */}
          <Route path='student' element={<Student/>}>

           <Route index element={<StudentDetails/>} />
         <Route path='schedule' element={<ScheduleStudent/>} />
         <Route path='attendance' element={<AttendanceStudent/>} />
         <Route path='examinations' element={<ExaminationsStudent/>} />
         <Route path='notice' element={<NoticeStudent/>} />
          
          </Route>

       {/* //// Teacher ////// */}
         <Route path='teacher' element={<Teacher/>}>
         <Route index element={<TeacherDetails/>} />
         <Route path='schedule' element={<ScheduleTeacher/>} />
         <Route path='attendance' element={<AttendaceTeacher/>} />
         <Route path='examinations' element={<ExaminationsTeacher/>} />
         <Route path='notice' element={<NoticeTeacher/>} />
        </Route> 
       

  {/* //// Client  ////// */}
         <Route path='/' element={<Client/>}>
         <Route index element={<Home/>} />
         <Route path='login' element={<Login/>} />
         <Route path='register' element={<Register/>} />


        </Route> 
       





      </Routes>
    </BrowserRouter>
   
    </>
  )
}

export default App
