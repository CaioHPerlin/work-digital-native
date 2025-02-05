import React, { useMemo } from "react";
import { Text as RNText, TextProps } from "react-native";

const FixedText: React.FC<TextProps> = ({ children, ...props }) => {
  const modifiedChildren = useMemo(() => {
    return `${children} `;
  }, [children]);

  return <RNText {...props}>{modifiedChildren}</RNText>;
};

export default FixedText;
