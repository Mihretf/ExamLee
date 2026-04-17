import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import NavBar from './NavBar';
import WhyUs from './WhyUs';
import Fotter from '../../components/layout/Fotter';


function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <HeroSection />
      <HowItWorks />
      <WhyUs />
      <Fotter />
    </div>
  );
}

export default LandingPage;