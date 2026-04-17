import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import NavBar from './NavBar'
import WhyUs from './WhyUs';


function LandingPage() {
  return (
  
  <div className='flex flex-col min-h-screen'>
    <NavBar />
    <HeroSection/>
    <HowItWorks/>
    <WhyUs/>
  </div>
  
)
}

export default LandingPage;