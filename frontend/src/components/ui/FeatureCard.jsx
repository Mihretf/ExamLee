function FeatureCard({
  title,
  description,
  imageSrc,
  imageAlt = "Feature illustration",
  side = "left",
  className = "",
}) {
  const isRightSided = side === "right";
  const verticalAlternateClass = isRightSided ? "self-end" : "self-start";

  return (
    <article
      className={`w-[60vw]  max-h-[25rem] rounded-2xl border-2 border-dashed border-primary bg-secondary px-4 py-5 sm:px-6 sm:py-6 md:px-7 md:py-7 ${verticalAlternateClass} ${className}`}
    >
      <div
        className={`flex flex-col items-center gap-4 md:gap-6 ${
          isRightSided ? "md:flex-row-reverse" : "md:flex-row"
        }`}
      >
        <div className="flex w-full justify-center md:w-5/12">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-auto w-full max-w-[180px] object-contain sm:max-w-[220px] md:max-w-[250px]"
          />
        </div>

        <div className="w-full text-center md:w-7/12 md:text-left">
          <h3 className="mb-2 font-poppins text-2xl font-extrabold leading-tight text-primary sm:text-3xl">
            <span className="mr-2 text-yellow-500">✦</span>
            {title}
          </h3>
          <p className="font-poppins text-base leading-relaxed text-slate-700 sm:text-lg">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}

export default FeatureCard;