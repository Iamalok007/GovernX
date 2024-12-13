// components/Feedback.tsx
"use client";

interface FeedbackProps {
    feedback: string;
  }
  
  const Feedback = ({ feedback }: FeedbackProps) => {
    return (
      <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#f4f4f4", borderRadius: "8px" }} className="text-black">
        <h3>Feedback</h3>
        <pre>{feedback}</pre>
      </div>
    );
  };
  
  export default Feedback;
  