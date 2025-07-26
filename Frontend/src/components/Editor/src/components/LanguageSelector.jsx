import {
  Box,
  Button,
  Menu,
  MenuList,
  MenuItem,
  Text,
  MenuButton,
} from "@chakra-ui/react";

import { LANGUAGE_VERSIONS } from "../constants";
import Logo from "../../../Logo"
import "./style.css"
import { useState,useContext } from "react";
import light from "/light.svg"
import Dark from "/dark.svg"
import darkExpand from "/expand.svg"
import LightExpand from "/lightExpand.svg"
import darkDec from "/darkArr.svg"
import lightDec from "/lightArr.svg"
import { StudentContext } from "../../../../context/StudentContext";

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = "blue.400";

const LanguageSelector = ({ language, onSelect, onWidthChange,onDarkChange, expand }) => {
  const { dark,setDark,width,setWidth } = useContext(StudentContext);
  const handleWidthChange = (newWidth) => {
    onWidthChange(newWidth);
  };

  const handleDarkChange = (change) => {
    onDarkChange(change);
  };
  
  const handleMode = () => {
    const change = dark===false ? true : false;
    console.log(change)
    setDark(change);
    handleDarkChange(change);
  }
  const handleWidth = () => {
    const newWidth = width === "100" ? "50" : "100";
    setWidth(newWidth);
    handleWidthChange(newWidth);
  }
  return (
    <Box ml={2} mb={4}>
      <Box mb={2} fontSize="lg">
        <Logo size="25px" color={dark?"white":'black'}/>
        <div className="screenAndLang">
          
        Language:
        <div className="fullAndScreen">
        <Button
        variant="outline"
        colorScheme={dark ? "blue" : "black"}
        size={5}
        fontSize={12}
        padding={2}
        border={0}
        onClick={handleMode}
        > {dark ? <img src={light} alt="light" style={{width:"12px"}}/> : <img src={Dark} alt="dark" style={{width:"12px"}}/> }
      </Button>
      <Button
        variant="outline"
        colorScheme={dark ? "blue" : "black"}
        ml={5}
        // padding={2}
        p={2}
        
        display={expand==="1"?"none":""}
        
       height={6}
       width={6}
       onClick={handleWidth}
       border={0}
        > 
          {width === "100" && dark ? (
    <img src={lightDec} alt="minimize" style={{ width: "12px" }} />
  ) : width === "100" && !dark ? (
    <img src={darkDec} alt="minimize" style={{ width: "12px" }} />
  ) : width !== "100" && dark ? (
    <img src={LightExpand} alt="minimize" style={{ width: "12px" }} />
  ) : (
    <img src={darkExpand} alt="minimize" style={{ width: "12px" }} />
  )} 
      </Button>
      
        </div>
        
        </div>
      </Box>
      <Menu isLazy>
        <MenuButton bg = {!dark ? "#A7A7A8" : "gray.900"} 
        color={dark ? "white" : "#251010"}
        _hover={{
          color: (!dark ? "black" : ACTIVE_COLOR),
          bg: (!dark ? "#6b6b72" : null),
          
        }}
        as={Button}>{language}</MenuButton>
        <MenuList bg={dark ? "#110c1b" : "black"}>
          {languages.map(([lang, version]) => (
            <MenuItem
              key={lang}
              color={lang === language ? ACTIVE_COLOR : ""}
              bg={lang === language ? "gray.900" : "transparent"}
              _hover={{
                color: (dark ? ACTIVE_COLOR : "#f3f5f9"),
                bg: (dark ? "gray.900" : "#5b5d63"),
              }}
              onClick={() => onSelect(lang)}
            >
              {lang}
              &nbsp;
              <Text as="span" color="green" fontSize="sm">
                ({version})
              </Text>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};
export default LanguageSelector;
