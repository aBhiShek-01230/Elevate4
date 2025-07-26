import React, { useState, useContext, useRef, useEffect } from "react";
import { Copy } from "lucide-react";
import { StudentContext } from "../context/StudentContext";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const Chat = ({left,width,question,from}) => {
  const [expanded, setExpanded] = useState(false);
  const [max, setMax] = useState(false);
  const scrollRef = useRef(null);
  const { backendUrl, setHidden,dark,language,sourceCode } = useContext(StudentContext);
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
   
  });
  
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  // Save messages to localStorage on update
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, newUserMessage];
    setLoading(true);

    try {
      const formattedHistory = updatedMessages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : msg.role,
        parts: [{ text: msg.content }],
      }));
      
      console.log(sourceCode)
      const response = await axios.post(backendUrl + "/chat/reply", {
        userInput: input,
        history: formattedHistory,
        question : question,
        language: language,
        sourceCode:sourceCode
       
        
      });

      setMessages((prev) => [...prev, newUserMessage]);
      animateTyping(response.data.response);
      setInput("");
    } catch (error) {
      console.error(error.response?.data || "Error fetching assistant reply");
    } finally {
      setLoading(false); // End loading
    }
  };

const animateTyping = (text) => {
  let index = 0;
  setTypingMessage(""); // Start fresh

  const interval = setInterval(() => {
    setTypingMessage((prev) => prev + text.charAt(index));
    index++;

    if (index >= text.length) {
      clearInterval(interval);
      setMessages((prev) => [...prev, { role: "assistant", content: text }]);
      setTypingMessage("");
    }
  }, 5); // 20ms per character
};


  const formatInline = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
      .replace(
        /`(.*?)`/g,
        "<code class='bg-gray-200 rounded px-1 text-blue-500 font-mono'>$1</code>" // Inline code
      );
  };

  const handleNewChat = () => {
    localStorage.removeItem("chatMessages");
    setMessages([]);
    setInput("");
  };

  const parseMessage = (text) => {
    const parts = text.split(/(```[\s\S]*?```)/g); // Separate code blocks

    return parts.map((part, i) => {
      // Code Block
      if (part.startsWith("```") && part.endsWith("```")) {
        const language = part.match(/```(\w+)/)?.[1] || "";
        const code = part.replace(/```(\w+)?\n?/, "").replace(/```$/, "");

        return (
          <div
            key={i}
            className="relative bg-gray-900 text-white p-4 rounded-lg mt-2 font-mono text-sm overflow-auto"
          >
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-300">{language}</span>
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="text-xs text-blue-400 hover:underline"
              >
                <Copy className="w-4 h-4 inline" /> Copy
              </button>
            </div>
            <SyntaxHighlighter
              language={language}
              style={vscDarkPlus}
              customStyle={{
                background: "transparent",
                margin: 0,
                padding: 0,
                fontSize: "0.85rem",
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        );
      }

      // Text or inline markdown block
      const formatted = part.split("\n").map((line, index) => {
        if (line.trim().startsWith("*")) {
          const text = line.replace(/^\*\s*/, "");

          return (
            <li key={index} className="list-disc ml-4">
              <span
                dangerouslySetInnerHTML={{
                  __html: formatInline(text),
                }}
              />
            </li>
          );
        }

        return (
          <p
            key={index}
            className="mb-1 whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: formatInline(line),
            }}
          />
        );
      });

      return <div key={i}>{formatted}</div>;
    });
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = textarea.scrollHeight + "px"; // Set to scroll height
    }
  }, [input]);

  useEffect(()=>{
      if(width){
        setExpanded(true)
      }
      if(from === "course"){
        setExpanded(true)
        setMax(true)
      }
  },[])

  return (
    <div
      className={`fixed bottom-2 ${ max  ? "max-w-[40%]" :  width ? "max-w-xl" :"max-w-sm"} ${left ? left:"right-2"} w-full z-50`}
    >
      {!expanded  ? (
        <div >
          <p className="font-bold mb-1 ml-[30%]">Your AI Assistant</p>
          <div className={`flex items-center justify-between bg-white shadow-lg rounded-md cursor-pointer pl-2 pr-2 ${width ? 'p-3 border-1 border-amber-600':null} ` }>
            <input
              type="text"
              className="outline-none w-full p-3"
              placeholder="Ask anything"
              onClick={() => setExpanded(true)}
            />
            <img src="/ai.svg" className="w-10 h-10 ml-2" alt="AI" />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-2xl flex flex-col h-[98vh] border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className={`flex items-center justify-between p-3 border-b border-gray-200 ${dark ? "bg-[#222222]": "bg-gray-100"}`}>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {

                  !width ? setExpanded(false)   : setHidden(true);
                  setMax(false);
                 
                }}
              >
                <img src="/prev.svg" className="w-5 h-5" alt="Back" />
              </button>
              <h2 className={`text-xl font-bold  `}>AI Assistant</h2>
            </div>
            <div className="flex items-center gap-3">
              <img
                src="/edit.svg"
                className="w-5 h-5 cursor-pointer"
                alt="New Chat"
                onClick={handleNewChat}
              />
              {width ? null :
              <img
                src={max ? "/darkArr.svg" : "/expand.svg"}
                className="w-5 h-5 cursor-pointer"
                alt="Expand"
                onClick={() => setMax(!max)}
              />}
            </div>
          </div>

          {/* Chat Body */}
         <div
  ref={scrollRef}
  className={`flex-1 overflow-y-auto px-4 py-2 space-y-4 ${dark ? " bg-[#0f0a19]" : "bg-gray-50"}`}
>
  {messages.map((msg, idx) => (
    <div
      key={idx}
      className={`max-w-[100%] px-4 py-2 rounded-lg ${
        msg.role === "user"
          ? "self-end text-right ml-auto"
          : ` ${dark ? "bg-[#222222]" : "bg-gray-100"} self-start text-left`
      }`}
    >
      {parseMessage(msg.content)}
    </div>
  ))}

  {typingMessage && (
    <div className={`max-w-[100%] px-4 py-2 rounded-lg ${dark ? "bg-[#222222] text-white": "bg-gray-100"} self-start text-left  `}>
      {parseMessage(typingMessage)}
      <span className="animate-pulse">|</span>
    </div>
  )}

  {loading && !typingMessage && (
    <div className={`max-w-[100%] px-4 py-2 rounded-lg ${dark ? "bg-[#222222] text-white": "bg-gray-100"} self-start text-left animate-pulse` }>
      Assistant is typing...
    </div>
  )}
</div>


          {/* Input Field */}
          <div className= {`p-3 border-t border-gray-200 flex items-end gap-2   ${dark ? "bg-[#222222] text-white ": width?"bg-gray-800 text-white":"bg-gray-100"}`}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // Prevent newline
                  handleSend(input);
                  setInput(""); // Clear after sending
                }
              }}
              rows={1}
              className={`flex-1 border border-gray-300 rounded-md px-3 py-2  outline-none resize-none overflow-hidden max-h-60 `}
              placeholder="Ask something..."
            />
            <button
              onClick={() => {
                handleSend(input);
                setInput(); // Clear after sending
              }}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 "
            >
              Ask
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
