// src/pages/register/Register.jsx
import { useNavigate } from "react-router-dom";
import RegisterComponent from "../../components/regizster/RegisterComponent";

export default function Registration() {
  const navigate = useNavigate();

  return (
    <RegisterComponent
      onGoLogin={() => navigate("/login")}
    />
  );
}