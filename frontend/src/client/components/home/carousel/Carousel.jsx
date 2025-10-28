
import { useState } from "react";
import  SwipeableView from 'react-swipeable-views';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwordIosIcon from '@mui/icons-material/ArrowForwardIos'
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";


const carouselItems = [
    {
        image:"https://img.freepik.com/free-psd/instagram-posts-collection-back-school_23-2148631837.jpg?semt=ais_hybrid&w=740&q=80",
        title:"Explore Our Classrooms",
        description:" Engaging and inspiring environment for every student.",
    },

     {
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTpRLWVGwe8tUiDVOJKfcULxtWkItOxbZymA&s",
        title:"02 Our Classrooms",
        description:"02 Engaging and inspiring environment for every student.",
    },

     {
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPXeviqgLkOApe-5DzKxKHffz53Ecic-terg&s",
        title:"03 Our Classrooms",
        description:"03 Engaging and inspiring environment for every student.",
    },

];

export default function Carousel (){
    const [activeIndex, setActiveIndex] = useState(0);

    const handleNext = ()=>{
        setActiveIndex((prev)=>(prev + 1)% carouselItems.length);
    }
    const handleBack =()=>{
        setActiveIndex((prev)=>prev ===0 ?carouselItems.length -1 : prev -1 );
    }
    return (
       <Box
  sx={{
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    overflow: "hidden",
    position: "relative",
  }}
>

            <SwipeableView index= {activeIndex} onChangeIndex={(index)=> setActiveIndex(index)}>
                {carouselItems.map((item, index)=>(
                    <Box key = {index} sx={{position:'relative', textAlign:"center", color:"white"}}>
                <img
  src={item.image}
  alt={item.title}
  style={{
    width: "100%",
    height: "auto",
    maxHeight: "80vh", 
    objectFit: "cover",
    objectPosition: "center",
    borderRadius: "8px",
    display: "block",
  }}
/>

                        <Box sx={{position:'absolute', bottom:20, left:"50%", transform:"translateX(-50%)", bgcolor:"rgba(0,0,0,0.6", padding:"10px 20px", borderRadius:1}}>
                        <Typography variant="h5" >{item.title}</Typography>
                        <Typography variant="body1" >{item.description}</Typography>


                        </Box>
                    </Box>
                ))}
            </SwipeableView>

         
            <Box sx={{position:"absolute", top:"50%", left:0, transform:"translateY(-50%)", zIndex:1}}>
           <Button variant="contained" onClick={handleBack} >
            <ArrowBackIosIcon/>

           </Button>

            </Box>
            <Box sx={{position:'absolute', top:"50%", right:0, transform:"translateY(-50%)", zIndex:1}}>
                <Button variant="contained" onClick={handleNext} >
                    <ArrowForwordIosIcon />
                </Button>
         

         </Box>
        </Box>
    )
}
