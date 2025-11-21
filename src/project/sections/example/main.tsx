import { createSection } from "../../../toolkit/createSection";
import App from "./App";
import "tailwindcss/index.css";


export default createSection(<App />, {
  name: "example",
  settings: [
    {
      type: "text",
      id: "title",
      label: "Title",
      default: "Hello World",
    },
    {
      type: "text",
      id: "description",
      label: "Description",
      default: "This is a description",
    },
  ],
});
