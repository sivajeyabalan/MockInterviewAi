import { Link } from "react-router-dom";

export const LogoContainer = () => {
  return (
    <Link to={"/"} className="flex items-center">
      <span className="text-2xl font-bold text-primary">MockAI</span>
    </Link>
  );
};
