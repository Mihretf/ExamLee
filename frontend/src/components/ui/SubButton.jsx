function SubButton({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-secondary text-primary font-poppins font-semibold py-1.5 border-2 border-dashed border-primary px-4 rounded-full hover:bg-secondary/80 transition-colors duration-300"
    >
      {text}
    </button>
  );
}

export default SubButton;