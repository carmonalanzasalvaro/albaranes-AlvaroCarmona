interface ButtonProps {
  children: React.ReactNode;
  CallbackOnClick: () => void;
}

export default function Button({ children, CallbackOnClick }: ButtonProps) {
  return (
    <button onClick={CallbackOnClick} className="bg-orange-300 hover:bg-orange-400 transition-all rounded px-4 py-2">
      {children}
    </button>
  );
}
