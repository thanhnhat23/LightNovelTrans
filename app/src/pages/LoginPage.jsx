import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { BookOpenText, Mail, Lock, EyeOff, Eye, Loader2} from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/ui/AuthImagePattern";
import { toast } from "react-hot-toast";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const {login, isLoggingIn} = useAuthStore();

    const validateForm = () => {
        if (!formData.email || !formData.password) return toast.error('All fields are required');
        if (!formData.email.trim()) return toast.error('Email is required');
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error('Email is invalid');
        if (!formData.password.trim()) return toast.error('Password is required');
        if (formData.password.length < 6) return toast.error('Password must be at least 6 characters long');

        return true;
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const success = validateForm();
        if (success === true) login(formData)
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left side */}
            <AuthImagePattern 
                title="Welcome to my page"
                subtitle="This is where I share my own Manga or Light Novel translations. I hope you enjoy my translations."
            />

            {/* Right side */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-10">
                    {/* Logo + Title */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-sky/10 flex items-center 
                            justify-center group-hover:bg-sky/20 transition-colors border-2 border-primary_blue">
                                <BookOpenText className="size-6 text-primary_blue" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2 pointer-events-none text-black">Login Account</h1>
                            <p className="text-base-content/80 pointer-events-none text-black/70">Welcome back</p>
                        </div>
                    </div>
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-7">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-black">Email</span>
                            </label>
                            <div className="relative">
                                <input 
                                    type="email"
                                    className={`input input-bordered w-full pl-10 text-black drop-shadow-md
                                                bg-white border-2 border-milk`}
                                    placeholder="you@gmail.com"
                                    value={formData.email}
                                    onChange={(event) => setFormData({ ...formData, email: event.target.value})}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="size-5 opacity-40" color="black"/>
                                </div>
                            </div>
                        </div>
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
                                    onChange={(event) => setFormData({ ...formData, password: event.target.value})}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 opacity-40" color="black"/>
                                </div>
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center
                                    bg-white border-2 border-milk border-l-0 hover:bg-white"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-5 opacity-40" color="black"/>
                                    ) : (
                                        <Eye className="size-5 opacity-40" color="black"/>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="text-end">
                            <p className="text-base-content/60 text-black font-medium">
                                <Link to="/forgot-password" className="text-primary_blue hover:text-true_blue">
                                    Forgot password?
                                </Link>
                            </p>
                        </div>

                        <button 
                            type="submit"
                            className="btn submit"
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    Loading ...
                                </>
                            ) : (
                                "Login Account"
                            )}
                        </button>

                        <div className="text-center">
                            <p className="text-base-content/60 text-black font-medium">
                                Don't have an account? {" "}
                                <Link to="/signup" className="text-primary_blue hover:text-true_blue">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;