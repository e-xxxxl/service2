import Faq from "../components/Faq/Faq"
import Footer from "../components/Footer/Footer"
import AboutUs from "../components/Herosection/AboutUs"
import FeaturedCategories from "../components/Herosection/FeaturedCategories"
import Hero from "../components/Herosection/Hero"
import HowItWorks from "../components/Herosection/HowItworks"
import StatsBanner from "../components/Herosection/StatsBanner"
import Navbar from "../components/Navbar/Navbar"


const HomePage = () => {
  return (
    <>
    <Navbar/>
    <Hero/>
        <HowItWorks/>
             <FeaturedCategories/>
             <StatsBanner/>
             <Faq/>
             <AboutUs/>
             <Footer/>  

    </>
  )
}

export default HomePage