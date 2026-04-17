function MainButton({ text, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center bg-primary text-white font-poppins font-semibold py-2 px-5 rounded-full shadow-sm hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md transition-all duration-300 ${className}`}
    >
      {text}
    </button>
  );
}

export default MainButton;