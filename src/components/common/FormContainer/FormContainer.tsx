import { ReactNode } from "react";

interface FormContainerProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

const FormContainer = ({ title, subtitle, children, footer }: FormContainerProps) => {
  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-600 mt-2">{subtitle}</p>
      </div>

      {children}

      {footer && <div className="text-center mt-4">{footer}</div>}
    </div>
  );
};

export default FormContainer;
