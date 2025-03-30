import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const navigate = useNavigate();
  const { forgotPassword, isForgotPassword } = useAuthStore();

  const validateForm = () => {
    if (!formData.email) return false;
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const success = validateForm();
    if (success === true) forgotPassword(formData, navigate);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center mb-8 w-96 p-10 rounded shadow-md bg-white/50">
        <div className="flex flex-col items-center gap-2 group mb-6 text-black">
          <h1 className="text-2xl font-bold mt-2 pointer-events-none">
            Forgot Password?
          </h1>
          <p className="text-base-content/80 pointer-events-none">
            Please enter your email !
          </p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="form-control">
            <div className="relative">
              <input
                type="email"
                className={`input input-bordered w-full pl-10 text-black drop-shadow-md
                                            bg-white border-2 border-milk`}
                placeholder="you@gmail.com"
                value={formData.email}
                onChange={(event) =>
                  setFormData({ ...formData, email: event.target.value })
                }
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="size-5 opacity-40" color="black" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn submit"
            disabled={isForgotPassword}
          >
            {isForgotPassword ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading ...
              </>
            ) : (
              "Forgot password"
            )}
          </button>
          <div className="text-center relative bottom-0">
            <p className="text-base-content/60 text-black font-medium">
              <Link
                to="/login"
                className="text-primary_blue hover:text-true_blue"
              >
                Back to login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
