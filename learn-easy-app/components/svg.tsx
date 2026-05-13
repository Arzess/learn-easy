import React from "react";
import { SvgXml } from "react-native-svg";
import {colors} from "@/constants/theme";
import findSvg from "./svg-sheet";

const SVG = ({ icon, width, height, white } : {icon: String, width: number, height: number, white: boolean}) => {
  // @ts-ignore
  return <SvgXml xml={findSvg(icon, white)} width={width} height={height} />;
};
export default SVG;

