import MainButton from "../../components/ui/MainButton";
import SubButton from "../../components/ui/SubButton";
import lee from '../../assets/lee-holding-a-book.svg'

function HeroSection() {
    return (
        <div className="w-full px-4 py-10 sm:px-6 md:px-10 md:py-14 lg:px-16 lg:py-20">
            <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-8 lg:flex-row lg:gap-12">
                <div className="flex w-full flex-col items-center text-center lg:max-w-3xl lg:items-start lg:text-left">
                    <p className="mb-5 font-poppins text-4xl font-bold leading-[1.1] text-primary sm:text-5xl md:text-6xl lg:text-7xl">
                        Past Exams.<br /> Real Results. <br /> Less Stress.
                    </p>

                    <p className="mb-7 max-w-2xl text-base leading-relaxed text-gray-700 sm:text-lg md:text-xl">
                        Stop digging through random group chats. Find verified exams from your campus and prepare with confidence.
                    </p>
                    <section className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
                        <MainButton text="Browse Exams" onClick={() => alert('Get Started clicked!')} className="w-full justify-center sm:w-auto" />
                        <SubButton text="Upload Exams" onClick={() => alert('Learn More clicked!')} className="w-full justify-center sm:w-auto" />
                    </section>

                </div >
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                    <img src={lee} alt="Lee" className="h-auto w-full object-contain" />
                </div>
            </div>
        </div>

    )
}

export default HeroSection;