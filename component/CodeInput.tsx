// components/CodeInput.tsx
"use client";
import { useState } from 'react';

interface CodeInputProps {
  exercise: string;
  onSubmit: (code: string) => void;
}

const CodeInput = ({ exercise, onSubmit }: CodeInputProps) => {
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(code);
  };

  return (
    <div>
      <h2 className='text-white'>{exercise}</h2>
      <textarea
        rows={6}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code here..."
        className='text-black'
        style={{ width: "100%", padding: "10px", fontSize: "16px" }}
      />
      <button onClick={handleSubmit} style={{ marginTop: "10px" }} className='bg-blue-500 text-white'>
        Submit Code
      </button>
    </div>
  );
};

export default CodeInput;
