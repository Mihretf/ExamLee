import MainButton from "../../components/ui/MainButton";
import SubButton from "../../components/ui/SubButton";
import lee from '../../assets/lee-holding-a-book.svg'

function HeroSection() {
    return (
        <div className="w-full px-6 md:px-10 lg:px-16 py-12 md:py-20">
            <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-10 lg:flex-row">
                <div className="flex flex-col">
                    <p className="text-5xl md:text-6xl lg:text-7xl leading-tight font-poppins font-bold text-primary mb-6">
                    Past Exams.<br></br> Real Resuts. <br></br> Less Stess.<br></br>
                </p>

                <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl leading-relaxed">
                    Stop digging through random group chats. Find verified exams from your campus and prepare with confidence.
                </p>
                <section className="flex flex-wrap gap-4">
                    <MainButton text="Browse Exams" onClick={() => alert('Get Started clicked!')} />
                    <SubButton text="Upload Exams" onClick={() => alert('Learn More clicked!')} />
                </section>

                </div >
                <div className="w-full max-w-md lg:max-w-lg">
                 <img src={lee} alt="Lee" className="w-full max-h-[28rem] object-contain" />   
                </div>
            </div>
        </div>

    )
}

export default HeroSection;