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
        <Route path='subject' element={<Subjects/>} />
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

       {/* //// Teacher ////// */}
         <Route>

        </Route> 
       

  {/* //// Client  ////// */}
         <Route>

        </Route> 
       





      </Routes>
    </BrowserRouter>
   
    </>
  )
}

export default App
