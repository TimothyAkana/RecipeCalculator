import { useState } from "react";

export const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(''),
    bind: {
      value: value,
      onChange: (event) => {
        setValue(event.target.value);
      }
    }
  };
};
