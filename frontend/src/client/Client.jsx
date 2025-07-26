import { Outlet } from "react-router-dom";
import Navbar from "./utility component/navbar/Navbar";
import Footer from "./utility component/footer/Footer";
import Box from "@mui/material/Box";


export default function Client(){
    return (
         <div>
  <Navbar/>
  <Box sx={{minHeight:'80vh'}} component={'div'}> 
    <Outlet/>
</Box>
    <Footer/>
        </div>
    )
}