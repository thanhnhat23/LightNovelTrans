import { Pen } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

const EditProfile = ({ setSelectImg, setSelectBackground, closeEditor }) => {
  const {
    updateProfile,
    isUpdatingProfile,
    updateBackground,
    isUpdatingBackground,
    authUser,
    updateInfo,
    isUpdatingInfo,
  } = useAuthStore();

  const [formData, setFormData] = useState({
    linkSocial_1: "",
    linkSocial_2: "",
    linkSocial_3: "",
    nameSocial_1: "",
    nameSocial_2: "",
    nameSocial_3: "",
    bio: "",
    nameTag: "",
  });

  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (authUser) {
      const initialData = {
        nameSocial_1: authUser.nameSocial_1 || "",
        nameSocial_2: authUser.nameSocial_2 || "",
        nameSocial_3: authUser.nameSocial_3 || "",
        linkSocial_1: authUser.linkSocial_1 || "",
        linkSocial_2: authUser.linkSocial_2 || "",
        linkSocial_3: authUser.linkSocial_3 || "",
        bio: authUser.bio || "",
        nameTag: authUser.nameTag || "",
      };

      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [authUser]);

  const handleUpdateProfile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  const handleUpdateBackground = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectBackground(base64Image);
      await updateBackground({ profileBackground: base64Image });
    };
  };

  const handleUpdateInfo = async () => {
    const updatedData = {
      ...formData,
      nameTag:
        formData.nameTag.trim() === ""
          ? `#${authUser.userName}-neko`
          : formData.nameTag.startsWith("#")
          ? formData.nameTag.trim()
          : `#${formData.nameTag.trim()}`,
    };

    Object.keys(updatedData).forEach((key) => {
      // Nếu nhập mới, cập nhật
      if (updatedData[key] !== originalData[key]) {
        updatedData[key] = updatedData[key].trim();
      }
      // Nếu xóa dữ liệu, chuyển thành rỗng
      else if (updatedData[key].trim() === "") {
        updatedData[key] = "";
      }
      // Nếu giữ nguyên giá trị cũ, không thay đổi
      else {
        updatedData[key] = originalData[key];
      }
    });

    setFormData(updatedData);
    await updateInfo(updatedData);
  };

  const handleBioChange = (e) => {
    const words = e.target.value.trim().split(/\s+/);
    if (words.length > 880) return;
    setFormData({ ...formData, bio: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleUpdateInfo();
  };

  return (
    <div className="flex justify-center items-center min-h-screen -mt-9 lg:mt-14">
      <div
        className="w-[80vw] lg:w-[29rem] h-[50rem] rounded-3xl flex flex-col mt-[25vw] lg:mt-0 relative
            bg-white border-2 border-milk drop-shadow-md"
      >
        <div className="w-full mt-4">
          <div className="flex text-black justify-center items-center m-5 font-bold">
            <p>EDIT PROFILE</p>
            <Pen size={16} className="mt-1 ml-2" />
            <div className="absolute right-3 top-3">
              <button className="btn close" onClick={closeEditor}>
                X
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6">
            <div className="flex flex-col items-start">
              {/* Background Upload */}
              <div className="flex relative m-3">
                <label
                  htmlFor="background-upload"
                  className="text-black font-bold"
                >
                  Background:{" "}
                </label>
                <input
                  type="file"
                  id="background-upload"
                  accept="image/*"
                  disabled={isUpdatingBackground}
                  onChange={handleUpdateBackground}
                  className="file-input lg:w-80 h-8 ml-4 file-input-neutral text-black drop-shadow-md
                                    bg-black/10 border-2 border-gray/10 focus:outline-none"
                />
              </div>
              {/* Avatar Upload */}
              <div className="flex relative m-3">
                <label
                  htmlFor="profile-upload"
                  className="text-black font-bold"
                >
                  Avatar:{" "}
                </label>
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  disabled={isUpdatingProfile}
                  onChange={handleUpdateProfile}
                  className="file-input lg:w-80 h-8 ml-14 file-input-neutral text-black drop-shadow-md
                                    bg-black/10 border-2 border-gray/10 focus:outline-none"
                />
              </div>
              {/* NameTag */}
              <div className="flex relative m-3">
                <label htmlFor="nameTag" className="text-black font-bold">
                  NameTag:{" "}
                </label>
                <input
                  type="text"
                  placeholder="Name tag"
                  id="nameTag"
                  value={formData.nameTag}
                  disabled={isUpdatingInfo}
                  onChange={(e) =>
                    setFormData({ ...formData, nameTag: e.target.value })
                  }
                  className="input input-bordered lg:w-80 h-8 ml-9 text-black drop-shadow-md
                                    bg-black/10 border-2 border-gray/10 focus:outline-none"
                />
              </div>
              {/* Social Media Inputs */}
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex relative m-3">
                  <input
                    type="text"
                    placeholder="Social name"
                    value={formData[`nameSocial_${index}`]}
                    disabled={isUpdatingInfo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [`nameSocial_${index}`]: e.target.value,
                      })
                    }
                    className="input input-bordered w-28 text-black drop-shadow-md
                                        bg-black/10 border-2 border-gray/10 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Social media link"
                    value={formData[`linkSocial_${index}`]}
                    disabled={isUpdatingInfo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [`linkSocial_${index}`]: e.target.value,
                      })
                    }
                    className="input input-bordered lg:w-72 ml-7 text-black drop-shadow-md
                                        bg-black/10 border-2 border-gray/10 focus:outline-none"
                  />
                </div>
              ))}
              ;{/* Bio */}
              <div className="flex flex-col relative m-3">
                <label htmlFor="bio" className="w-28 text-black mb-4 font-bold">
                  Bio:{" "}
                </label>
                <textarea
                  id="bio"
                  placeholder="Write your bio here. Max 880 words."
                  value={formData.bio}
                  disabled={isUpdatingInfo}
                  onChange={handleBioChange}
                  className="textarea h-48 w-[73vw] lg:w-[27rem] text-black drop-shadow-md
                                    bg-black/10 border-2 border-gray/10 resize-none focus:outline-none"
                />
              </div>
              {/* Save Button */}
              <button
                type="submit"
                disabled={isUpdatingInfo}
                className="btn editProfile m-3"
                onClick={closeEditor}
              >
                {isUpdatingInfo ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
