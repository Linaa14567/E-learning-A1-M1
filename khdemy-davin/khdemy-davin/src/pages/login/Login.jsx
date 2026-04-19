
import { useNavigate } from "react-router-dom";
import LoginComponent from "../../components/login/LoginComponent";

export default function Login() {
  const navigate = useNavigate();
  return (
    <LoginComponent
      onSuccess={() => navigate("/home")}
      onGoRegister={() => navigate("/register")}
      onForgotPassword={() => navigate("/forgot-password")}
    />
  );
}