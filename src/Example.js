import { useEffect } from "react";

// step #1
import { useLocalStorage } from "./lib";
import "./styles.css";

export default function Example() {
  // step #2 initiate hook
  const { storedValue } = useLocalStorage("testKey", 123);

  useEffect(() => {
    // step #3 track if you can react to changes in LS outside of this component as well
    console.log("value in local storage has been changed:", storedValue);
  }, [storedValue]);

  return (
    <div className="App">
      <h1>current val is {storedValue}</h1>
      <h2>Start editing to see some magic happen!</h2>
      <NestedComponent />
    </div>
  );
}

const NestedComponent = () => {
  const { setValue } = useLocalStorage("testKey");

  return (
    <button onClick={() => setValue(Math.random())}>set smth to ls</button>
  );
};
