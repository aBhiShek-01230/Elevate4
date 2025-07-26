import React, { useContext, useEffect, useRef, useState } from "react";
import Logo from "../components/Logo";
import axios from "axios";
import { StudentContext } from "../context/StudentContext";
const Drawing = () => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [selectedTool, setSelectedTool] = useState("brush");
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushWidth, setBrushWidth] = useState(5);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedBgColor, setSelectedBgColor] = useState("#ffffff");
  const [fillColor, setFillColor] = useState(false);
  const [snapshot, setSnapshot] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [dark, setDark] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [inputText, setInputText] = useState("");
  const [running, setRunning] = useState(false);
  const [outputText, setOutputText] = useState("");
  const [expanded, setExpanded] = useState(false);
  const textRef = useRef(null);
  const [typingMessage, setTypingMessage] = useState("");
  const MAX_UNDO_STATES = 20;
  let prevMouseX = useRef(0);
  let prevMouseY = useRef(0);
  const { backendUrl } = useContext(StudentContext);

  useEffect(() => {
    if (textRef.current) {
      // Reset height to recalculate
      textRef.current.style.height = "auto";

      // Set new height based on scroll height
      textRef.current.style.height =
        Math.min(textRef.current.scrollHeight, window.innerHeight - 100) + "px";

      // Add scroll if content exceeds max height
      if (textRef.current.scrollHeight > window.innerHeight - 100) {
        textRef.current.style.overflowY = "auto";
      } else {
        textRef.current.style.overflowY = "hidden";
      }
    }
  }, [typingMessage]); // runs every time typingMessage updates

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const context = canvas.getContext("2d");

    setCtx(context);
    saveCanvasState(context);
  }, []);
  useEffect(() => {
    if (selectedTool === "eraser") {
      setBrushWidth(30);
    } else if (selectedTool === "text") {
      setBrushWidth(20);
    } else {
      setBrushWidth(5);
    }
  }, [selectedTool]);

  const handleBgColorChange = (color) => {
    setSelectedBgColor(color);

    // Delay canvas background update until ctx is ready
    if (ctx) {
      updateCanvasBgColor(color);
    }
  };

  useEffect(() => {
    if (ctx && canvasRef.current) {
      ctx.fillStyle = selectedBgColor;
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [ctx, selectedBgColor]);

  useEffect(() => {
    if (dark) {
      setSelectedBgColor("black");
      setSelectedColor("white");
    }
  }, [dark]);

  const saveCanvasState = (context) => {
    const newStack = [
      ...undoStack,
      context.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      ),
    ];
    if (newStack.length > MAX_UNDO_STATES) newStack.shift();
    setUndoStack(newStack);
    setRedoStack([]);
  };

  const handleToolChange = (tool) => setSelectedTool(tool);

  const handleMouseDown = (e) => {
    // If the selected tool is text, handle it separately
    if (selectedTool === "text") {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setTextPosition({ x, y });
      setIsTyping(true);
      return; // Skip drawing logic for text
    }

    setIsDrawing(true);
    prevMouseX.current = e.nativeEvent.offsetX;
    prevMouseY.current = e.nativeEvent.offsetY;

    if (!ctx) return;

    ctx.beginPath();
    ctx.lineWidth = brushWidth;
    ctx.strokeStyle =
      selectedTool === "eraser" ? selectedBgColor : selectedColor;
    ctx.fillStyle = selectedColor;
    ctx.moveTo(prevMouseX.current, prevMouseY.current);

    setSnapshot(
      ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
    );

    // Set composite mode
    ctx.globalCompositeOperation = "source-over";
  };

  const drawTextOnCanvas = (text, x, y) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.font = "20px Arial";
    ctx.fillStyle = selectedColor || "black"; // or whatever color you're using
    ctx.fillText(text, x + 2, y + 25);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !ctx || !snapshot) return;

    ctx.putImageData(snapshot, 0, 0);
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    switch (selectedTool) {
      case "brush":
        ctx.lineTo(x, y);
        ctx.stroke();
        break;

      case "rectangle":
        const rectWidth = x - prevMouseX.current;
        const rectHeight = y - prevMouseY.current;
        if (!fillColor) {
          ctx.strokeRect(
            prevMouseX.current,
            prevMouseY.current,
            rectWidth,
            rectHeight
          );
        } else {
          ctx.fillRect(
            prevMouseX.current,
            prevMouseY.current,
            rectWidth,
            rectHeight
          );
        }
        break;

      case "line":
        ctx.beginPath();
        ctx.moveTo(prevMouseX.current, prevMouseY.current);
        ctx.lineTo(x, y);
        ctx.stroke();
        break;

      case "circle":
        const radius = Math.sqrt(
          Math.pow(x - prevMouseX.current, 2) +
            Math.pow(y - prevMouseY.current, 2)
        );
        ctx.beginPath();
        ctx.arc(prevMouseX.current, prevMouseY.current, radius, 0, 2 * Math.PI);
        fillColor ? ctx.fill() : ctx.stroke();
        break;

      case "triangle":
        ctx.beginPath();
        ctx.moveTo(prevMouseX.current, prevMouseY.current); // top point
        ctx.lineTo(x, y); // bottom right
        ctx.lineTo(2 * prevMouseX.current - x, y); // bottom left
        ctx.closePath();
        fillColor ? ctx.fill() : ctx.stroke();
        break;

      case "arrow":
        const dx = x - prevMouseX.current;
        const dy = y - prevMouseY.current;
        const angle = Math.atan2(dy, dx);
        const headlen = 10;

        // Main line
        ctx.beginPath();
        ctx.moveTo(prevMouseX.current, prevMouseY.current);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Arrowhead
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(
          x - headlen * Math.cos(angle - Math.PI / 6),
          y - headlen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          x - headlen * Math.cos(angle + Math.PI / 6),
          y - headlen * Math.sin(angle + Math.PI / 6)
        );
        ctx.lineTo(x, y);
        ctx.closePath();
        fillColor ? ctx.fill() : ctx.stroke();
        break;

      case "eraser":
        ctx.lineTo(x, y);
        ctx.stroke();
        break;

      default:
        break;
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (ctx) saveCanvasState(ctx);
  };

  const undo = () => {
    if (undoStack.length > 1) {
      const newStack = [...undoStack];
      const lastState = newStack.pop();
      setRedoStack([lastState, ...redoStack]);
      setUndoStack(newStack);
      ctx.putImageData(newStack[newStack.length - 1], 0, 0);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const [latest, ...rest] = redoStack;
      setUndoStack([...undoStack, latest]);
      setRedoStack(rest);
      ctx.putImageData(latest, 0, 0);
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d", { willReadFrequently: true });

    context.clearRect(0, 0, canvas.width, canvas.height);

    // Refill background
    context.fillStyle = selectedBgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    saveCanvasState(context);
  };

  const updateCanvasBgColor = (color) => {
    const canvas = canvasRef.current;
    const tempCtx = canvas.getContext("2d");

    // Create a temporary canvas
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCanvasCtx = tempCanvas.getContext("2d");

    // Fill with new background color
    tempCanvasCtx.fillStyle = color;
    tempCanvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw current canvas on top
    tempCanvasCtx.drawImage(canvas, 0, 0);

    // Replace original canvas
    tempCtx.clearRect(0, 0, canvas.width, canvas.height);
    tempCtx.drawImage(tempCanvas, 0, 0);

    saveCanvasState(tempCtx);
  };

  const handleRun = async () => {
    setRunning(true);
    setExpanded(true);
    setOutputText(""); // Clear previous output

    try {
      const canvas = canvasRef.current;
      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      const formData = new FormData();
      formData.append("image", blob, "canvas.png");

      const response = await axios.post(
        `${backendUrl}/chat/analyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);
      animateTyping(response.data.response);
    } catch (error) {
      console.error(error);
      setOutputText("Retry");
    } finally {
      setRunning(false);
      console.log(parseMessage);
    }
  };

  const animateTyping = (text) => {
    let index = 0;
    setTypingMessage(""); // Assuming this is a separate state for typing animation

    const interval = setInterval(() => {
      setTypingMessage((prev) => {
        const updated = prev + text.charAt(index);
        index++;

        // When done
        if (index >= text.length) {
          clearInterval(interval);
          setOutputText(updated); // ✅ Now it's done
          setTypingMessage(""); // Clear typing state
        }

        return updated;
      });
    }, 5); // Typing speed
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

  const formatInline = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italic
      .replace(
        /`(.*?)`/g,
        "<code class='bg-gray-200 rounded px-1 text-blue-500 font-mono'>$1</code>" // Inline code
      );
  };

  const handleStop = () => {
    setRunning(false);
    setExpanded(false);
  };

  return (
    <div className="flex w-full h-screen p-2 gap-2 bg-gray-500">
      {/* ------------Left Side ----------------- */}
      <section
        className={`w-[210px]   ${
          dark ? "bg-[#10172a] text-white" : "bg-[#f3f5f9]"
        } rounded-lg shadow hover:shadow-2xl flex flex-col  items-center max-h-screen overflow-scroll pt-1`}
      >
        <div className="div flex items-center gap-5">
          <Logo size="25px" color={dark ? "white" : "black"} />
          <img
            src={dark ? "/light.svg" : "/dark.svg"}
            className="w-5 cursor-pointer"
            onClick={() => setDark(!dark)}
            alt=""
          />
        </div>
        <div className="w-full h-0.5 bg-gray-500"></div>

        <div className="flex flex-col items-center pl-7 pr-7 gap-1 mt-2">
          <label className="font-bold ">Shapes</label>

          <div
            className={` ${
              dark ? "bg-[#242d45]" : "bg-white"
            } shadow hover:shadow-2xl flex flex-wrap p-4 gap-5 rounded-lg items-center`}
          >
            <p
              className="text-3xl font-bold cursor-pointer hover:scale-110 "
              onClick={() => handleToolChange("text")}
            >
              T
            </p>
            <img
              src={selectedTool == "line" ? "/line-a.png" : "/line.png"}
              className="w-6 cursor-pointer hover:scale-110"
              onClick={() => handleToolChange("line")}
            />
            <img
              src={selectedTool == "arrow" ? "/arrow-a.svg" : "/arrow.svg"}
              className="w-6 cursor-pointer hover:scale-110"
              onClick={() => handleToolChange("arrow")}
            />
            <img
              src={
                selectedTool == "rectangle"
                  ? "/rectangle-a.svg"
                  : "/rectangle.svg"
              }
              className="w-6 cursor-pointer hover:scale-110"
              onClick={() => handleToolChange("rectangle")}
            />
            <img
              src={selectedTool == "circle" ? "/circle-a.svg" : "/circle.svg"}
              className="w-6 cursor-pointer hover:scale-110"
              onClick={() => handleToolChange("circle")}
            />
            <img
              src={
                selectedTool == "triangle" ? "/triangle-a.png" : "/triangle.png"
              }
              className="w-6 cursor-pointer hover:scale-110"
              onClick={() => handleToolChange("triangle")}
            />
          </div>

          <label className="flex items-center gap-2 text-md ">
            <input
              type="checkbox"
              checked={fillColor}
              onChange={() => setFillColor(!fillColor)}
              className=" cursor-pointer scale-150"
            />{" "}
            Fill Color
          </label>

          <label className="font-bold mt-5">Options</label>

          <div
            className={`${
              dark ? "bg-[#242d45]" : "bg-white"
            } shadow hover:shadow-2xl flex flex-wrap p-4 gap-5 rounded-lg items-center `}
          >
            <img
              src={selectedTool == "brush" ? "/brush-a.svg" : "/brush.svg"}
              className="w-6 cursor-pointer hover:scale-110"
              onClick={() => handleToolChange("brush")}
            />
            <img
              src={selectedTool == "eraser" ? "/eraser-a.svg" : "/eraser.svg"}
              className="w-6 cursor-pointer hover:scale-110"
              onClick={() => handleToolChange("eraser")}
            />
          </div>
          <input
            type="range"
            min={selectedTool === "eraser" ? "15" : "1"}
            max={selectedTool === "eraser" ? "100" : "30"}
            value={brushWidth}
            onChange={(e) => setBrushWidth(e.target.value)}
            className="w-3/5"
          />
        </div>

        <label className="font-bold mt-7">Colors</label>
        <div
          className={` ${
            dark ? "bg-[#242d45]" : "bg-white"
          } shadow hover:shadow-2xl flex flex-wrap p-2 gap-1.5 rounded-lg items-center mt-1`}
        >
          {["#ffffff", "#000000", "#E02020", "#6DD400", "#4A98F7"].map(
            (color, idx) => (
              <div
                key={idx}
                className={`w-5 h-5 rounded-full cursor-pointer border-1 ${
                  selectedColor === color ? "ring-2 ring-blue-500" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              ></div>
            )
          )}
          <input
            type="color"
            className="w-6 rounded-full cursor-pointer"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
          />
        </div>

        <label className="font-bold mt-7">Background</label>
        <div
          className={` ${
            dark ? "bg-[#242d45]" : "bg-white"
          } shadow hover:shadow-2xl flex flex-wrap p-2 gap-1.5 rounded-lg items-center mt-1`}
        >
          {["#ffffff", "#000000", "#E02020", "#6DD400", "#4A98F7"].map(
            (color, idx) => (
              <div
                key={idx}
                className={`w-5 h-5 rounded-full cursor-pointer border-1 ${
                  selectedBgColor === color ? "ring-2 ring-blue-500" : ""
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleBgColorChange(color)} // ✅ FIX HERE
              ></div>
            )
          )}

          <input
            type="color"
            className="w-6 rounded-full cursor-pointer"
            value={selectedBgColor}
            onChange={(e) => handleBgColorChange(e.target.value)}
          />
        </div>

        {/* //Download and Clear */}
        <div
          className={`div  ${
            dark ? "bg-[#242d45]" : "bg-white"
          }  shadow hover:shadow-2xl flex flex-wrap p-2 gap-5 rounded-lg items-center mt-5`}
        >
          <button onClick={downloadCanvas}>
            <img
              src="download.svg"
              className="w-6 cursor-pointer hover:scale-110"
              alt="download"
            />
          </button>

          <button onClick={clearCanvas}>
            <img
              src="/clear.png"
              className="w-6 cursor-pointer hover:scale-110"
              alt="clear"
            />
          </button>
        </div>
        <div
          className={`div  ${
            dark ? "bg-[#242d45]" : "bg-white"
          }  shadow hover:shadow-2xl flex flex-wrap p-2 gap-5 rounded-lg items-center mt-5`}
        >
          <button onClick={undo}>
            <img
              src="/undo.png"
              alt="undo"
              className="w-6 cursor-pointer hover:scale-110"
            />
          </button>
          <button onClick={redo}>
            <img
              src="/redo.png"
              alt="redo"
              className="w-6 cursor-pointer hover:scale-110"
            />
          </button>
        </div>
      </section>

      {/* -----------Canvas ------------ */}
      <section className="relative flex-1 bg-white rounded-lg">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            cursor:
              selectedTool === "brush"
                ? "url('/pen.png') 0 16, auto"
                : selectedTool === "eraser"
                ? "url('/eraser.png') 0 16, auto"
                : [
                    "rectangle",
                    "circle",
                    "line",
                    "triangle",
                    "arrow",
                    "text",
                  ].includes(selectedTool)
                ? "crosshair"
                : "default",
          }}
          className="w-full h-full"
        />

        {isTyping && selectedTool === "text" && (
          <input
            type="text"
            autoFocus
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                drawTextOnCanvas(inputText, textPosition.x, textPosition.y);
                setIsTyping(false);
                setInputText("");
              }
            }}
            style={{
              position: "absolute",
              top: textPosition.y,
              left: textPosition.x,
              fontSize: brushWidth,
              border: "1px solid #ccc",
              padding: "2px",
              color: selectedColor || "black",
            }}
          />
        )}
      </section>
      {/* -------- Floating Run/Stop Buttons ---------- */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 cursor-pointer max-h-screen overflow-y-auto">
        {/* Output Box with Glowing Border */}
        {(running || expanded) && (
          <div className="relative w-64 max-h-[80vh] overflow-y-auto">
            {running ? (
              <div className="w-full min-h-24 max-h-64 p-3 bg-black text-white rounded-md resize-y font-mono border-4 animate-gradient-border flex items-center justify-center">
                <img src="/loading1.gif" alt="loading" className="w-10" />
              </div>
            ) : (
              <div
                ref={textRef}
                className="w-full min-h-24 p-3 bg-black text-white rounded-md font-mono border-4 animate-gradient-border resize-none"
                style={{
                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
              >
            <div className="flex items-center justify-between mb-2">
              <img src="/lightBack.svg" className="w-5 h-5" alt="Back" onClick={()=>{
                setRunning(false)
                setExpanded(false)
              }} />
            </div>
                {typingMessage || parseMessage(outputText)}
              </div>
            )}
          </div>
        )}

        {/* Run/Stop Button */}
        <button
          onClick={!running ? handleRun : handleStop}
          className={`${
            running
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          } text-white font-bold py-2 px-4 rounded shadow-lg`}
        >
          {!running ? "▶ Run" : "Stop"}
        </button>
      </div>
    </div>
  );
};

export default Drawing;


