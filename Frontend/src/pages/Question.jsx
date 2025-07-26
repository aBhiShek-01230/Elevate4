import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Chat from "../components/Chat";
import { StudentContext } from "../context/StudentContext";
import Editor from "../components/Editor/src/components/CodeEditor";
import axios from "axios";

const Question = () => {
  const { dark, setDark, width, setWidth, hidden, setHidden } =
    useContext(StudentContext);

  const { id } = useParams();
  const { navigate, backendUrl } = useContext(StudentContext);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    const getQuestion = async () => {
      try {
        const response = await axios.post(backendUrl + "/practice/question", {
          questionId: id,
        });
        console.log(response.data.data);
        setQuestion(response.data.data);
      } catch (err) {
        console.error("Failed to fetch course", err);
      }
    };

    getQuestion();
  }, []);

  return (
    <div>




     {question?.compiler?

      <div className={`flex flex-col lg:flex-row gap-2 p-2  min-h-screen ${
        dark ? "bg-[#0f0a19] text-white" : "bg-[#f3f5f9] text-black"
      }`}>

        {hidden ? (
        <div
          className={`max-h-screen overflow-scroll no-scrollbar shadow-2xl rounded-lg pb-10 ${
            dark ? "border-gray-500 text-white" : " text-black"
          } ${
             width !== "100"
                ? "w-0"
                : "w-full lg:w-[40vw]"
             
          }`}
        >
          {/* Title */}
          <div className={` font-bold  m-3 flex items-center justify-between` }>
            <span className="text-2xl">{question?.name}</span>
          </div>

          {/* Divider */}
          <div
            className={`w-full h-0.5 ${dark ? "bg-gray-500" : "bg-blue-200"}`}
          />

          {/* Problem Description */}
          <div className="text-base px-4 py-2">
            <span className="font-semibold text-yellow-500">Medium</span>
            <br />
            <br />
            <p>{question?.description}</p>
          </div>

          {/* -------------------Example ------------------ */}
          {question?.examples?.length > 0
            ? question.examples.map((example, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-4 mx-4 mt-4 ${
                    dark ? "bg-[#222222] text-white" : "bg-white text-black"
                  }`}
                >
                  <p className="text-lg font-semibold mb-2">
                    Example {index + 1}:
                  </p>
                  <p>
                    <span
                      className={`${
                        dark ? "text-[#4cc8b0]" : "text-[#b76b01]"
                      }`}
                    >
                      Input:
                    </span>{" "}
                    {example?.input}
                  </p>
                  <p>
                    <span
                      className={`${
                        dark ? "text-[#4cc8b0]" : "text-[#b76b01]"
                      }`}
                    >
                      Output:
                    </span>{" "}
                    {example?.output}
                  </p>
                  <p>
                    <span
                      className={`${
                        dark ? "text-[#4cc8b0]" : "text-[#b76b01]"
                      }`}
                    >
                      Explanation:
                    </span>{" "}
                    {example?.explanation}
                  </p>
                </div>
              ))
            : null}

          {/* Constraints */}

          {question?.constraints?.length > 0 ? (
            <div className="p-4">
              <span className="text-lg font-semibold">Constraints:</span>
              <br />
              <br />
              {question?.constraints.map((cons, idx) => (
                <div
                  key={idx}
                  className={`text-base my-2 px-3 py-2 rounded-lg border ${
                    dark
                      ? "bg-[#363636] border-gray-500 text-white"
                      : "bg-white border-blue-200 text-black"
                  }`}
                >
                  {cons}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className={`${width !== "100" ? "w-0" : "w-full lg:w-[40vw]"}`}>
          <Chat left={"left-2"} width={true} question={question} />
        </div>
      )}

      {/* Right: Editor */}
      
        <div
          className={`rounded-lg p-3 border-2 ${
            dark ? "border-gray-500" : "border-blue-200"
          } ${width !== "100" ? "w-full" : "w-full lg:w-[60vw]"}`}
        >
          <Editor />
        </div>
      
      </div>
      

      :

      // -------------Without Compiler ------------
      
      <div className={`flex flex-col lg:flex-row gap-2 p-2  min-h-screen ${
        dark ? "bg-[#0f0a19] text-white" : "bg-[#f3f5f9] text-black"
      }`}>
       
        <div
          className={`max-h-screen overflow-scroll no-scrollbar shadow-2xl rounded-lg pb-10 ${
            dark ? "border-gray-500 text-white" : " text-black"
          } ${
            hidden? "":
            "w-full lg:w-[60vw]"
          }`}
        >
          {/* Title */}
          <div className={` font-bold  m-3 flex items-center justify-between` }>
            <span className="text-2xl">{question?.name}</span>
            {question?.compiler == false ? <div className="div flex items-center gap-5">
              <button className="border-1 p-2 text-sm rounded-md cursor-pointer shadow border-green-500" onClick={()=>setHidden(!hidden)}>Ask AI</button>
              <img src={dark ? "/light.svg":"/dark.svg"} alt="" className="w-4 cursor-pointer hover:scale-110" onClick={()=>setDark(!dark)} />
            </div>:null}
          </div>

          {/* Divider */}
          <div
            className={`w-full h-0.5 ${dark ? "bg-gray-500" : "bg-blue-200"}`}
          />

          {/* Problem Description */}
          <div className="text-base px-4 py-2">
            <span className="font-semibold text-yellow-500">Medium</span>
            <br />
            <br />
            <p>{question?.description}</p>
          </div>

          {/* -------------------Example ------------------ */}
          {question?.examples?.length > 0
            ? question.examples.map((example, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-4 mx-4 mt-4 ${
                    dark ? "bg-[#222222] text-white" : "bg-white text-black"
                  }`}
                >
                  <p className="text-lg font-semibold mb-2">
                    Example {index + 1}:
                  </p>
                  <p>
                    <span
                      className={`${
                        dark ? "text-[#4cc8b0]" : "text-[#b76b01]"
                      }`}
                    >
                      Input:
                    </span>{" "}
                    {example?.input}
                  </p>
                  <p>
                    <span
                      className={`${
                        dark ? "text-[#4cc8b0]" : "text-[#b76b01]"
                      }`}
                    >
                      Output:
                    </span>{" "}
                    {example?.output}
                  </p>
                  <p>
                    <span
                      className={`${
                        dark ? "text-[#4cc8b0]" : "text-[#b76b01]"
                      }`}
                    >
                      Explanation:
                    </span>{" "}
                    {example?.explanation}
                  </p>
                </div>
              ))
            : null}

          {/* Constraints */}

          {question?.constraints?.length > 0 ? (
            <div className="p-4">
              <span className="text-lg font-semibold">Constraints:</span>
              <br />
              <br />
              {question?.constraints.map((cons, idx) => (
                <div
                  key={idx}
                  className={`text-base my-2 px-3 py-2 rounded-lg border ${
                    dark
                      ? "bg-[#363636] border-gray-500 text-white"
                      : "bg-white border-blue-200 text-black"
                  }`}
                >
                  {cons}
                </div>
              ))}
            </div>
          ) : null}
        </div>
     
       {hidden ? null:
       
        <div className={`${width !== "100" ? "w-0" : "w-full lg:w-[40vw]"}`}>
          <Chat width={true} question={question} />
        </div>}
      
      </div>
     
    }




    </div>
    
  );
};

export default Question;
   