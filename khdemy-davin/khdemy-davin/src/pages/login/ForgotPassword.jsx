import { useNavigate } from "react-router-dom";
import ForgotPasswordComponent from "../../components/login/ForgotPasswordComponent";

export default function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <ForgotPasswordComponent
      onBack={() => navigate(-1)}
      onGoLogin={() => navigate("/login")}
    />
  );
}