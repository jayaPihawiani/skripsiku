import React from "react";

const InputComponents = ({
  classStyle,
  style,
  placeHolder,
  type,
  change,
  val,
}) => {
  return (
    <input
      type={type}
      className={classStyle}
      placeholder={placeHolder}
      style={style}
      onChange={change}
      value={val}
    />
  );
};

export default InputComponents;
