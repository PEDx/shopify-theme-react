import { useState } from "react";

export default function App() {
  return (
    <div className="text-2xl font-bold">
      Hello World <Counter />
    </div>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      Counter {count}{" "}
      <button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
