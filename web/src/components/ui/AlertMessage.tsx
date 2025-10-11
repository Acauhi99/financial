import { CheckCircle } from "lucide-react";

interface AlertMessageProps {
  type: "success" | "error";
  message: string;
}

export function AlertMessage({ type, message }: Readonly<AlertMessageProps>) {
  const styles = {
    success: "bg-green-50 border-green-200 text-green-600",
    error: "bg-red-50 border-red-200 text-red-600",
  };

  return (
    <div className={`mb-6 p-4 border rounded-lg ${styles[type]}`}>
      {type === "success" ? (
        <div className="flex items-center space-x-2">
          <CheckCircle size={20} />
          <p className="text-sm font-medium">{message}</p>
        </div>
      ) : (
        <p className="text-sm">{message}</p>
      )}
    </div>
  );
}
