import React from "react";
import "./App.css";
import Home from "./pages/Home";
import { HeaderComponent } from "./components/header";

const App: React.FC = () => {
  return (
    <>
      <HeaderComponent />
      <Home />
    </>
  );
};

export default App;
