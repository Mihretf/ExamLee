function Card({ heading, subtitle, number }) {
    return (
    <div className="w-full max-w-xs rounded-2xl border-2 border-dashed border-primary bg-secondary p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:max-w-sm sm:p-6">
      <div className="mb-5 flex items-center justify-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-primary bg-white sm:h-28 sm:w-28 md:h-32 md:w-32">
          <h1 className="font-poppins text-4xl font-extrabold text-primary sm:text-5xl md:text-6xl">{number}</h1>
        </div>
      </div>

      <h1 className="mb-2 text-center font-poppins text-2xl font-extrabold text-primary sm:text-3xl">{heading}</h1>
      <h2 className="text-center font-poppins text-base leading-relaxed text-primary/90 sm:text-lg">{subtitle}</h2>
        </div>
    );
}

export default Card;