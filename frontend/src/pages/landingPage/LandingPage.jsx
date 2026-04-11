import HeroSection from './HeroSection';
import NavBar from './NavBar'


function LandingPage() {
  return (
  
  <div className='flex flex-col min-h-screen'>
    <NavBar />
    <HeroSection/>
  </div>
  
)
}

export default LandingPage;