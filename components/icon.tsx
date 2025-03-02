import React from "react";
import { Feather } from "@expo/vector-icons";

export type IconProps = {
  color: string;
  size?: number;
};

export type IconFunction = (props: IconProps) => JSX.Element;

export type TabRoute = "index" | "explore" | "profile";

export const icon: Record<TabRoute, IconFunction> = {
  index: (props) => <Feather name="home" size={props.size || 24} {...props} />,
  explore: (props) => <Feather name="compass" size={props.size || 24} {...props} />,
  profile: (props) => <Feather name="user" size={props.size || 24} {...props} />,
};
