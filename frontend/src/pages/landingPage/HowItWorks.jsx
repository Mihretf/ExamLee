import Card from "../../components/ui/Card";

function HowItWorks() {

    return (
        <div className="how-it-works flex flex-col items-center gap-4 px-4 py-12 font-poppins md:px-8 lg:px-16">
            <h3 className="text-yellow-500 font-poppins text-2xl font-bold sm:text-3xl">How It Works</h3>
            <h1 className="text-center font-poppins text-3xl font-bold text-primary sm:text-4xl md:text-5xl lg:text-6xl">Past Exams, Simplified</h1>
            {/*these are the cards that show the steps to use the website*/}
            <div className="flex w-full flex-col items-center gap-6 md:flex-row md:justify-center md:gap-8 lg:gap-10">
                <Card heading={"Share"} subtitle={"upload past exams and share them with others"} number="1" />
                <Card heading={"Find"} subtitle={"search for exams by subject or year"} number="2" />
                <Card heading={"Prepare"} subtitle={"use the exams to prepare for your own"} number="3" />
            </div>
        </div>
    );
}


export default HowItWorks;