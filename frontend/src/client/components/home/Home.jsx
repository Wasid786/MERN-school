import { Box, useTheme } from "@mui/material";
import Carousel from "./carousel/Carousel";
import Gallery from "./gallery/Gallery";

export default function Home(){
      const theme = useTheme();
    return (
        <>
       <Box  sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: '100vh',
        padding: { xs: 2, sm: 4 },
      }}>
  <Carousel />
      <Gallery />
       </Box>
        </>
    )
}