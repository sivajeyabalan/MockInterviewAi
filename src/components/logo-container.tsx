import { Link } from "react-router-dom";
import { useState } from "react";

export const LogoContainer = () => {
  const [logoError, setLogoError] = useState(false);

  return (
    <Link
      to={"/"}
      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
    >
      {!logoError && (
        <img
          src="/sjbLogo.png"
          alt="SJB Logo"
          className="h-8 w-8 object-contain"
          onError={() => setLogoError(true)}
        />
      )}
      <span className="text-2xl font-bold text-primary">MockAI</span>
    </Link>
  );
};
