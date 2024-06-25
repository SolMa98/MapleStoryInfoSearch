import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/App.css";

import Main from "./pages/Main.js";
function App() {

  // 웹 페이지 진입 시 이동 경로 설정
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
