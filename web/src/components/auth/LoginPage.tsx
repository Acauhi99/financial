import { useState } from "react";
import { LoginForm } from "./LoginForm";

export function LoginPage() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const toggleMode = () => {
    setIsRegisterMode((prev) => !prev);
  };

  const handleRegisterSuccess = () => {
    setIsRegisterMode(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-200/30 to-gray-300/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-gray-200/30 to-gray-300/30 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <LoginForm
          onToggleMode={toggleMode}
          isRegisterMode={isRegisterMode}
          onRegisterSuccess={handleRegisterSuccess}
        />
      </div>
    </div>
  );
}
