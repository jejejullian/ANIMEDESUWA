import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import loginPhoto from "../assets/image/login.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { error: supabaseError } = await register(email, password, username);

    if (supabaseError) {
      toast.error(supabaseError.message);
      setIsLoading(false);
    } else {
      // 🔥 Beri pesan sukses, lalu tahan 1.5 detik sebelum pindah
      toast.success("Akun berhasil dibuat! Mengarahkan ke beranda...");
      
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  return (
    <div className="flex min-h-screen relative bg-base">
      <div 
        className="absolute lg:relative inset-0 lg:w-1/2 flex items-center justify-center text-white"
        style={{ backgroundImage: `url(${loginPhoto})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/60 lg:bg-black/30" />
        <div className="absolute top-8 z-10 text-center px-6">
          <Link to="/" className="font-logo text-3xl font-bold text-brand hover:scale-105 transition-transform block">
            Anime<span className="text-brand-light">Desuwa</span>
          </Link>
        </div>
      </div>

      <div className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-2xl bg-surface-1/80 lg:bg-surface-1 backdrop-blur-md border border-outline shadow-2xl">
          <h1 className="text-3xl font-bold mb-2 text-white text-center">Sign Up</h1>
          <p className="text-sm mb-8 text-foreground-muted text-center">Join our community with all time access and free</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground-muted mb-1">Username</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2.5 bg-surface-2 border border-outline rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand transition" 
                placeholder="desuwa_fans"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground-muted mb-1">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-surface-2 border border-outline rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand transition" 
                placeholder="anime@example.com"
              />
            </div>
            
            {/* 🔥 Input Password dengan Icon Mata */}
            <div>
              <label className="block text-sm font-medium text-foreground-muted mb-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  minLength="6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 bg-surface-2 border border-outline rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand transition pr-10" 
                  placeholder="Minimal 6 karakter"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-brand transition cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-6 bg-brand text-white font-bold py-2.5 rounded-lg hover:bg-brand-dark transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Memproses..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-foreground-muted text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-brand hover:text-brand-light font-medium underline-offset-4 hover:underline transition">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}