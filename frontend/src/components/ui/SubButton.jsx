function SubButton({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-secondary text-primary font-poppins font-semibold py-1.5 px-5 border-2 border-dashed border-primary rounded-full hover:bg-primary hover:text-white hover:border-solid hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm transition-all duration-300"
    >
      {text}
    </button>
  );
}

export default SubButton;