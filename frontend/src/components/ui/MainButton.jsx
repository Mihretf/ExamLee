function MainButton({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-primary text-white font-poppins font-semibold py-2 px-4 rounded-full hover:bg-primary/80 transition-colors duration-300"
    >
      {text}
    </button>
  );
}

export default MainButton;