import { LogIn, UserPlus, CheckCircle } from "lucide-react";
import { useAuthForm } from "../../hooks/useAuthForm";
import { FormField, PasswordField, AlertMessage } from "../ui";

interface LoginFormProps {
  onToggleMode: () => void;
  isRegisterMode: boolean;
  onRegisterSuccess: () => void;
}

export function LoginForm({
  onToggleMode,
  isRegisterMode,
  onRegisterSuccess,
}: Readonly<LoginFormProps>) {
  const {
    formData,
    error,
    fieldErrors,
    showSuccess,
    isLoading,
    handleSubmit,
    handleChange,
  } = useAuthForm(isRegisterMode, onRegisterSuccess);

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#loginGradient)" />
              <path
                d="M8 12h16v2H8v-2zm0 4h12v2H8v-2zm0 4h8v2H8v-2z"
                fill="white"
                opacity="0.9"
              />
              <circle cx="22" cy="10" r="3" fill="white" opacity="0.8" />
              <defs>
                <linearGradient
                  id="loginGradient"
                  x1="0"
                  y1="0"
                  x2="32"
                  y2="32"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#1f2937" />
                  <stop offset="1" stopColor="#374151" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isRegisterMode ? "Criar Conta" : "Bem-vindo"}
          </h1>
          <p className="text-gray-600">
            {isRegisterMode
              ? "Crie sua conta para começar a gerenciar suas finanças"
              : "Entre na sua conta para continuar"}
          </p>
        </div>

        {showSuccess && (
          <AlertMessage
            type="success"
            message="Conta criada com sucesso! Redirecionando para o login..."
          />
        )}

        {error && <AlertMessage type="error" message={error} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegisterMode && (
            <FormField
              label="Nome completo"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Seu nome completo"
              error={fieldErrors.name}
            />
          )}

          <FormField
            label="E-mail"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            error={fieldErrors.email}
          />

          <PasswordField
            label="Senha"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={isRegisterMode ? "Mínimo 6 caracteres" : "Sua senha"}
            error={fieldErrors.password}
          />

          <button
            type="submit"
            disabled={isLoading || showSuccess}
            className="w-full bg-gradient-to-r from-gray-900 to-gray-700 text-white py-3 px-4 rounded-lg font-medium hover:from-gray-800 hover:to-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-2"
          >
            {(() => {
              if (isLoading) {
                return (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                );
              }
              if (showSuccess) {
                return (
                  <>
                    <CheckCircle size={20} />
                    <span>Conta criada!</span>
                  </>
                );
              }
              return (
                <>
                  {isRegisterMode ? (
                    <UserPlus size={20} />
                  ) : (
                    <LogIn size={20} />
                  )}
                  <span>{isRegisterMode ? "Criar Conta" : "Entrar"}</span>
                </>
              );
            })()}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            {isRegisterMode ? "Já tem uma conta?" : "Não tem uma conta?"}
            <button
              type="button"
              onClick={onToggleMode}
              className="ml-2 text-gray-900 font-medium hover:text-gray-700 transition-colors cursor-pointer"
            >
              {isRegisterMode ? "Fazer login" : "Criar conta"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
