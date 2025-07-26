import React, { useContext, useEffect, useState } from "react";
import Logo from "../components/Logo";
import { useParams } from "react-router-dom";
import axios from "axios";
import { StudentContext } from "../context/StudentContext";

const Quiz = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [submittedQuestions, setSubmittedQuestions] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  const { backendUrl } = useContext(StudentContext);
  const { id } = useParams();

  useEffect(() => {
    const getQuiz = async () => {
      try {
        const response = await axios.post(backendUrl + "/global/quiz", {
          quizId: id,
        });
        setQuiz(response.data.data);
      } catch (err) {
        console.error("Failed to fetch quiz", err);
      }
    };
    getQuiz();
  }, []);

  const handleOptionClick = (option) => {
    if (submittedQuestions[current]) return; // prevent change after submission
    const updated = [...selectedOptions];
    updated[current] = option;
    setSelectedOptions(updated);
  };

  const handleNext = () => {
    if (current < quiz.questions.length - 1) setCurrent(current + 1);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleSubmit = () => {
    // Mark this question as submitted
    const updatedSubmitted = [...submittedQuestions];
    updatedSubmitted[current] = true;
    setSubmittedQuestions(updatedSubmitted);

    // Update score
    const q = quiz.questions[current];
    if (selectedOptions[current] === q.answer.correctOption) {
      setScore((prev) => prev + 1);
    }
  };

  const getBgClass = (option) => {
    if (submittedQuestions[current]) {
      if (option === quiz.questions[current].answer.correctOption) {
        return "bg-green-500 text-white";
      }
      if (selectedOptions[current] === option) {
        return "bg-red-500 text-white";
      }
    }
    return selectedOptions[current] === option
      ? "bg-blue-500 text-white"
      : "bg-white";
  };

  if (!quiz) return <div className="text-white">Loading...</div>;

  const question = quiz.questions[current];
  const isSubmitted = submittedQuestions[current];

  return (
    <div
      style={{ backgroundImage: "url('/qzBg.jpg')" }}
      className="relative h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center px-4"
    >
      {/* Logo in top-left corner */}
      <div className="absolute top-4 left-4">
        <Logo size="30px" />
      </div>

      <p className="text-2xl font-bold mb-5 shadow p-5 rounded-xl bg-white/80">
        {quiz?.title} Quiz
      </p>

      {/* Main Card */}
      <div className=" w-full md:w-2/3 lg:w-3/5 bg-[#f3f5f9] rounded-2xl p-8 shadow-2xl border border-gray-200">
        {/* Left Arrow */}
        {current > 0 && (
          <div
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 bg-white p-4 rounded-xl shadow transition-all duration-200"
          >
            <img src="/prev.svg" className="w-5" alt="Previous" />
          </div>
        )}

        {/* Right Arrow */}
        {current < quiz.questions.length - 1 && (
          <div
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 bg-white p-4 rounded-xl shadow transition-all duration-200"
          >
            <img src="/next.svg" className="w-5" alt="Next" />
          </div>
        )}

        {/* Question */}
        <p className="text-green-600 text-lg font-bold text-center mb-6">
          Q{current + 1}: {question.questionText}
        </p>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionClick(opt)}
              disabled={isSubmitted}
              className={`w-full text-center rounded-xl border border-gray-300 p-4 font-medium shadow hover:shadow-lg transition-all duration-200 ${
                isSubmitted ? "cursor-not-allowed" : "hover:scale-105 cursor-pointer"
              } ${getBgClass(opt)}`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Explanation if submitted */}
        {isSubmitted && (
          <div className="mt-6 text-sm text-gray-700 bg-white p-4 rounded">
            <strong>Explanation:</strong> {question.answer.explanation}
          </div>
        )}

        {/* Submit Button */}
        {!isSubmitted && (
          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Submit
          </button>
        )}

        {/* Final Score at last question */}
        {  submittedQuestions.every(Boolean) && (
          <p className="text-center mt-6 font-bold text-xl text-blue-700">
            Score: {score} / {quiz.questions.length}
          </p>
        )}
      </div>
    </div>
  );
};

export default Quiz;
