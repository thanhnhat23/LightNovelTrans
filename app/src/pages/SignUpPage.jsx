import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { BookOpenText, Mail, User, Lock, EyeOff, Eye, Loader2} from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../components/ui/AuthImagePattern";
import { toast } from "react-hot-toast";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const {signup, isSigningUp} = useAuthStore();

    const validateForm = () => {
        if (!formData.userName || !formData.email || !formData.password) return toast.error('All fields are required');
        if (!formData.userName.trim()) return toast.error('Full name is required');
        if (!formData.email.trim()) return toast.error('Email is required');
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error('Email is invalid');
        if (!formData.password.trim()) return toast.error('Password is required');
        if (formData.password.length < 6) return toast.error('Password must be at least 6 characters long');
        if (formData.password !== formData.confirmPassword) return toast.error('Passwords do not match');

        return true;
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        const success = validateForm();
        if (success === true) signup(formData)
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left side */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-10">
                    {/* Logo + Title */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-xl bg-gray/10 flex items-center 
                            justify-center group-hover:bg-sky/20 transition-colors border-2 border-true_blue">
                                <BookOpenText className="size-6 text-true_blue" />
                            </div>
                            <h1 className="text-2xl font-bold mt-2 pointer-events-none text-black">Create Account</h1>
                            <p className="pointer-events-none text-black/70">Get started with your free account</p>
                        </div>
                    </div>
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-7">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-black">Full Name</span>
                            </label>
                            <div className="relative">
                                <input 
                                    type="text"
                                    className={`input input-bordered w-full pl-10 text-black drop-shadow-md
                                                bg-white border-2 border-milk`}
                                    placeholder="Username ..."
                                    value={formData.userName}
                                    onChange={(event) => setFormData({ ...formData, userName: event.target.value})}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="size-5 opacity-40" color="black"/>
                                </div>
                            </div>
                        </div>
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
                                    bg-white hover:bg-white border-2 border-milk border-l-0"
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
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-bold text-black">Confirm Password</span>
                            </label>
                            <div className="relative">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"}
                                    className={`input input-bordered w-full pl-10 text-black drop-shadow-md
                                                bg-white border-2 border-milk`}
                                    placeholder=" ●●●●●●●●●● "
                                    value={formData.confirmPassword}
                                    onChange={(event) => setFormData({ ...formData, confirmPassword: event.target.value})}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 opacity-40" color="black"/>
                                </div>
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center
                                    bg-white hover:bg-white border-2 border-milk border-l-0"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="size-5 opacity-40" color="black"/>
                                    ) : (
                                        <Eye className="size-5 opacity-40" color="black"/>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            className="btn submit"
                            disabled={isSigningUp}
                        >
                            {isSigningUp ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    Loading ...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-base-content/60 text-black font-medium">
                            Already have an account? {" "}
                            <Link to="/login" className="link text-primary_blue hover:text-true_blue">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side */}
            <AuthImagePattern 
                title="Welcome to my page"
                subtitle="This is where I share my own Manga or Light Novel translations. I hope you enjoy my translations."
            />
        </div>
    )
}

export default SignUpPage;