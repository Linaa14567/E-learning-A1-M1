import { useNavigate } from "react-router-dom";
import RegisterComponent from "../../components/regizster/RegisterComponent";

export default function Registration() {
  const navigate = useNavigate();

  return (
    <RegisterComponent
      onSuccess={() => navigate("/home")}
      onGoLogin={() => navigate("/login")}
    />
  );
}