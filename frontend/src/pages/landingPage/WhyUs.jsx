import FeatureCard from "../../components/ui/FeatureCard";
import image1 from '../../assets/image-1-lee.svg'
import image2 from '../../assets/image-2-lee.svg'
import image3 from '../../assets/image-3-lee.svg'
import image4 from '../../assets/image-4-lee.svg'

function WhyUs () {

    return (
        <div className="how-it-works flex flex-col items-center gap-8 px-4 py-12 font-poppins sm:gap-10 md:gap-14 md:px-8 lg:px-16">
            <h3 className="text-yellow-500 font-poppins text-2xl font-bold sm:text-3xl">Why Choose Us?</h3>
         <FeatureCard title={"Verified Exams"} description={"All exams are verified by our team to ensure authenticity and relevance."} imageSrc={image1} />
         <FeatureCard title={"Campus-Specific"} description={"Find exams specific to your campus and courses for targeted preparation."} imageSrc={image2} side={"right"} />
         <FeatureCard title={"Community-Driven"} description={"Join a community of students sharing resources and supporting each other."} imageSrc={image3} />
         <FeatureCard title={"User-Friendly Interface"} description={"Navigate and find exams easily with our intuitive and responsive design."} imageSrc={image4} side={"right"} />

        </div>
    );

 }

export default WhyUs;