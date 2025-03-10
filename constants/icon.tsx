import React from "react";
import { Feather } from "@expo/vector-icons";

export type IconProps = {
  color: string;
  size?: number;
};

export type IconFunction = (props: IconProps) => JSX.Element;

export type TabRoute = "index" | "configuration" | "scanQr" | "generateQr";

export const icon: Record<TabRoute, IconFunction> = {
  index: (props) => <Feather name="home" size={props.size || 24} {...props} />,
  configuration: (props) => (
    <Feather name="settings" size={props.size || 24} {...props} />
  ),
  scanQr: (props) => (
    <Feather name="maximize" size={props.size || 24} {...props} />
  ),
  generateQr: (props) => (
    <Feather name="plus-square" size={props.size || 24} {...props} />
  ),
};
