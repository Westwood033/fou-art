import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import New from "./New";
import List from "./List";
import Detail from "./Detail";

function App() {

  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/list" element={<List />} />

      <Route path="/new" element={<New />} />

      <Route path="/show/:dossier_id_receive" element={<Detail />} />

    </Routes>
  );

}

export default App;