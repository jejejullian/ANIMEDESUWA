import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import { supabase } from "@lib/supabase";
import toast from "react-hot-toast";
import { FaEdit, FaSave, FaTimes, FaEnvelope, FaUserCircle, FaArrowLeft } from "react-icons/fa";
import PageHeader from "@components/ui/PageHeader";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [bioInput, setBioInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/login");
    }
  }, [user, navigate, isLoading]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();

        if (error) throw error;
        setProfileData(data);
        setBioInput(data.bio || "");
      } catch (error) {
        toast.error("Gagal mengambil data profil.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSaveBio = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from("profiles").update({ bio: bioInput }).eq("id", user.id);

      if (error) throw error;

      setProfileData({ ...profileData, bio: bioInput });
      setIsEditing(false);
      toast.success("Bio berhasil diperbarui!");
    } catch (error) {
      toast.error("Gagal menyimpan bio.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center text-white min-h-screen flex items-center justify-center">Memuat profil...</div>;
  }

  if (!profileData) return null;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-6 md:mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 p-2 sm:p-3 bg-surface-1 hover:bg-surface-2 border border-outline rounded-xl text-foreground-muted hover:text-brand transition cursor-pointer"
          aria-label="Kembali"
        >
          <FaArrowLeft />
          <span className="text-sm">Kembali</span>
        </button>
      </div>

      <div className="text-center">
        <PageHeader title="My Profile" />
      </div>

      <div className="bg-surface-1 border border-outline rounded-2xl shadow-lg relative pb-6 md:pb-10">
        {/* Banner */}
        <div className="h-24 md:h-32 bg-foreground-inverse-muted rounded-t-2xl border-b border-outline"></div>

        {/* Avatar + Info - di BAWAH banner, bukan di atasnya */}
        <div className="px-6 md:px-10 flex flex-col md:flex-row items-center md:items-center gap-4 md:gap-6 -mt-12 md:-mt-16">
          <div className="shrink-0 z-10">
            <img src={profileData.avatar_url} alt="Avatar" className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-surface-1 object-cover bg-surface-3 shadow-xl" />
          </div>

          <div className="flex-1 w-full text-center md:text-left pt-0 md:pt-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">{profileData.username}</h2>
            <p className="text-sm text-foreground-muted flex items-center justify-center md:justify-start gap-2 mt-1">
              <FaEnvelope className="text-xs" /> {user.email}
            </p>
          </div>
        </div>

        {/* BIO */}
        <div className="px-6 md:px-10 mt-8">
          <div className="bg-surface-2 border border-outline rounded-xl p-4 md:p-5 shadow-inner">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs md:text-sm font-semibold text-brand uppercase tracking-wider flex items-center gap-2">
                <FaUserCircle size={16} /> Tentang Saya
              </h3>

              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="text-xs md:text-sm text-foreground-muted hover:text-white flex items-center gap-1.5 transition cursor-pointer bg-surface-3 px-3 py-1.5 rounded-md">
                  <FaEdit /> Edit Bio
                </button>
              ) : (
                <button onClick={() => setIsEditing(false)} className="text-xs md:text-sm text-red-400 hover:text-red-300 flex items-center gap-1.5 transition cursor-pointer bg-red-400/10 px-3 py-1.5 rounded-md">
                  <FaTimes /> Batal
                </button>
              )}
            </div>

            {!isEditing ? (
              <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap mt-2">
                {profileData.bio ? profileData.bio : <span className="text-foreground-muted italic">Belum ada bio. Ceritakan sedikit tentang anime favoritmu!</span>}
              </p>
            ) : (
              <div className="space-y-3 mt-2">
                <textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Saya suka anime genre Isekai dan Slice of Life..."
                  className="w-full bg-surface-1 border border-brand/50 rounded-lg p-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand min-h-25 resize-y"
                />
                <button
                  onClick={handleSaveBio}
                  disabled={isSaving}
                  className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold py-2 px-5 rounded-lg flex items-center gap-2 transition cursor-pointer disabled:opacity-50 w-full sm:w-auto justify-center"
                >
                  {isSaving ? (
                    "Menyimpan..."
                  ) : (
                    <>
                      <FaSave /> Simpan Bio
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
