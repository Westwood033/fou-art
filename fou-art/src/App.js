import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import New from "./New";
import List from "./List";
import Detail from "./Detail";

function App() {

  return (
    <Routes>

      <Route path="/fou-art/" element={<Login />} />

      <Route path="/fou-art/list" element={<List />} />

      <Route path="/fou-art/new" element={<New />} />

      <Route path="/fou-art/show/:dossier_id_receive" element={<Detail />} />

    </Routes>
  );

}

export default App;