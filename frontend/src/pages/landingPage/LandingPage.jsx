import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import NavBar from './NavBar'


function LandingPage() {
  return (
  
  <div className='flex flex-col min-h-screen'>
    <NavBar />
    <HeroSection/>
    <HowItWorks/>
  </div>
  
)
}

export default LandingPage;