import { useState } from "react";
import { Loader2, Lock, EyeOff, Eye } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const { tokenReset } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    resetPasswordToken: tokenReset,
    password: "",
    confirmPassword: "",
  });
  const { resetPassword, isResetPassword } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    if (!formData.password.trim()) 
      return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters long");
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const success = validateForm();
    console.log("Sending reset request:", formData);
    if (success === true) resetPassword(formData, navigate);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="mb-8 w-96 p-10 rounded shadow-md bg-white/50">
        <div className="flex flex-col items-center gap-2 group mb-6 text-black">
          <h1 className="text-2xl font-bold mt-2 pointer-events-none">
            Create new password
          </h1>
          <p className="pointer-events-none">
            Please enter your new password !
          </p>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-7">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-black">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`input input-bordered w-full pl-10 text-black drop-shadow-md
                                            bg-white border-2 border-milk`}
                placeholder=" ●●●●●●●●●● "
                value={formData.password}
                onChange={(event) =>
                  setFormData({ ...formData, password: event.target.value })
                }
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="size-5 opacity-40" color="black" />
              </div>
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center
                                bg-white hover:bg-white border-2 border-rice border-l-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="size-5 opacity-40" color="black" />
                ) : (
                  <Eye className="size-5 opacity-40" color="black" />
                )}
              </button>
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold text-black">
                Confirm Password
              </span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`input input-bordered w-full pl-10 text-black drop-shadow-md
                                                bg-white border-2 border-milk`}
                placeholder=" ●●●●●●●●●● "
                value={formData.confirmPassword}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    confirmPassword: event.target.value,
                  })
                }
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="size-5 opacity-40" color="black" />
              </div>
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center
                                    bg-white hover:bg-white border-2 border-milk border-l-0"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-5 opacity-40" color="black" />
                ) : (
                  <Eye className="size-5 opacity-40" color="black" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn submit"
            disabled={isResetPassword}
          >
            {isResetPassword ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading ...
              </>
            ) : (
              "Reset password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
