import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CollectionProvider } from "./context/CollectionContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Album from "./pages/Album";

function App() {
  return (
    <AuthProvider>
      <CollectionProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/album"    element={<Album />} />
            <Route path="*"         element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </CollectionProvider>
    </AuthProvider>
  );
}

export default App;