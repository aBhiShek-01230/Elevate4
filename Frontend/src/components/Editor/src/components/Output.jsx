import { useState,useContext } from "react";
import { Box, Button, Text, useToast } from "@chakra-ui/react";
import { executeCode } from "../api";
import Ai from "/ai.png"
import { StudentContext } from "../../../../context/StudentContext";

const Output = ({ editorRef, language,width,mode,expand}) => {
  const toast = useToast();
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const { hidden, setHidden,setSourceCode } = useContext(StudentContext);

  const runCode = async () => {
     const sourceCode = editorRef.current.getValue();
     setSourceCode(sourceCode)
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred.",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box w={width ? `${width}%` : "100%"} > 
    
      <Text mb={2} fontSize="lg">
        Output
      </Text>

      <Box className="options" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Button
        variant="outline"
        colorScheme="green"
        color={mode ? null : "green"}
        mb={4}
        isLoading={isLoading}
        onClick={runCode}
      >
        Run Code
      </Button>
      <Button
      onClick={()=>setHidden(!hidden)}
        variant="outline"
       
        colorScheme="#6DB6DF"
        color={mode ? null : "black"}
        mb={4}
        
      >
        Ask AI  <img src={Ai} alt="" style={{ width: "35px" }}/>
      </Button>
      </Box>
     

      <Box
        height={width=== "100" ? "50vh" : "75vh"}
        p={2}
        color={isError ? "red.400" : ""}
        border="1px solid"
        borderRadius={4}
        borderColor={isError ? "red.500" : "#333"}
      >
        {output
          ? output.map((line, i) => <Text key={i}>{line}</Text>)
          : 'Click "Run Code" to see the output here'}
      </Box>
    </Box>
  );
};
export default Output;
