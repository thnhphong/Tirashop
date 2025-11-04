import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    avatar: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // ✅ Prefill user info
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({
        name: storedUser.name || "",
        email: storedUser.email || "",
        phone: storedUser.phone || "",
        avatar: storedUser.avatar || "",
      });
      setAvatarPreview(storedUser.avatar || null);
    }
  }, []);

  // ✅ Handle text input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // ✅ Handle avatar file selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Handle avatar upload (separated function)
  const handleAvatarUpload = async (userId, token) => {
    if (!avatarFile) return null;

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    const response = await axios.post(
      `http://localhost:5001/api/customers/profile/${userId}/avatar`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.avatar; // returns avatar path (e.g. /uploads/avatars/12345.png)
  };

  // ✅ Submit profile update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) return alert("User not found. Please log in again.");

      // 🧾 Step 1: Update basic profile
      const profileResponse = await axios.put(
        `http://localhost:5001/api/customers/profile/${storedUser.id}`,
        {
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 🖼️ Step 2: Upload avatar (if any)
      let avatarPath = user.avatar;
      if (avatarFile) {
        avatarPath = await handleAvatarUpload(storedUser.id, token);
      }

      // 🧠 Step 3: Update localStorage
      const updatedUser = {
        ...storedUser,
        ...user,
        avatar: avatarPath,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("✅ Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("❌ Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-3 overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={`http://localhost:5001${avatarPreview}`}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <i className="ri-user-line text-pink-600 text-xl"></i>
                )}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{user.name}</h3>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Profile Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 text-sm"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Profile Avatar
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
