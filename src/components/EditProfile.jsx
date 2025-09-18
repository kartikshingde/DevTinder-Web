import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const EditProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileUrl: "",
    gender: "",
    age: "",
    about: "",
    skills: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [originalData, setOriginalData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Populate form with user data from Redux
  useEffect(() => {
    if (user) {
      const userData = user.message || user;
      const initialData = {
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        profileUrl: userData.profileUrl || "",
        gender: userData.gender || "",
        age: userData.age || "",
        about: userData.about || "",
        skills: Array.isArray(userData.skills)
          ? userData.skills.join(", ")
          : userData.skills || "",
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          profileUrl: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profileUrl: "Image size must be less than 5MB",
        }));
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Clear any previous errors
      setErrors((prev) => ({ ...prev, profileUrl: "" }));
    }
  };

  const uploadImageToS3 = async (file) => {
    try {
      // Get upload URL from backend
      const uploadUrlResponse = await axios.post(
        BASE_URL + "/get-upload-url",
        { filename: file.name },
        { withCredentials: true }
      );

      const { uploadUrl, key } = uploadUrlResponse.data;

      // Upload file to S3
      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      // Get download URL (fix typo in backend response)
      const downloadUrlResponse = await axios.post(
        BASE_URL + "/get-download-url",
        { key },
        { withCredentials: true }
      );

      // Handle typo in backend response
      const downloadUrl =
        downloadUrlResponse.data.downloadUrl ||
        downloadUrlResponse.data.donwnloadUrl;

      return downloadUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Only validate if fields have values - make all fields optional for updates
    if (formData.firstName.trim() && formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (formData.lastName.trim() && formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.age && (formData.age < 18 || formData.age > 100)) {
      newErrors.age = "Age must be between 18 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");

    try {
      // Upload image first if a new file is selected
      let imageUrl = formData.profileUrl;
      if (selectedFile) {
        imageUrl = await uploadImageToS3(selectedFile);
      }

      // Check if any field has actually changed (including new image)
      const hasChanges =
        formData.firstName.trim() !== originalData.firstName.trim() ||
        formData.lastName.trim() !== originalData.lastName.trim() ||
        formData.email.trim() !== originalData.email.trim() ||
        imageUrl !== originalData.profileUrl.trim() ||
        formData.gender !== originalData.gender ||
        formData.age !== originalData.age ||
        formData.about.trim() !== originalData.about.trim() ||
        formData.skills.trim() !== originalData.skills.trim();

      if (!hasChanges) {
        setErrors({
          submit:
            "No changes detected. Please modify at least one field to update your profile.",
        });
        return;
      }

      // Prepare data to send
      const dataToSend = {};

      if (formData.firstName.trim())
        dataToSend.firstName = formData.firstName.trim();
      if (formData.lastName.trim())
        dataToSend.lastName = formData.lastName.trim();
      if (formData.email.trim()) dataToSend.email = formData.email.trim();
      if (imageUrl) dataToSend.profileUrl = imageUrl;
      if (formData.gender) dataToSend.gender = formData.gender;
      if (formData.age) dataToSend.age = parseInt(formData.age);
      if (formData.about.trim()) dataToSend.about = formData.about.trim();
      if (formData.skills.trim()) {
        dataToSend.skills = formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill);
      }

      // Update profile
      const response = await axios.patch(
        BASE_URL + "/profile/edit",
        dataToSend,
        { withCredentials: true }
      );

      // Update Redux store
      const updatedUser =
        response.data.data || response.data.user || response.data;
      dispatch(addUser(updatedUser));

      // Update local state
      if (updatedUser) {
        const userData = updatedUser.message || updatedUser;
        const updatedFormData = {
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || userData.emailId || "",
          profileUrl: userData.profileUrl || "",
          gender: userData.gender || "",
          age: userData.age || "",
          about: userData.about || "",
          skills: Array.isArray(userData.skills)
            ? userData.skills.join(", ")
            : userData.skills || "",
        };
        setFormData(updatedFormData);
        setOriginalData(updatedFormData);

        // Clear file selection and preview
        setImagePreview("");
        setSelectedFile(null);
        const fileInput = document.getElementById("profileImage");
        if (fileInput) fileInput.value = "";
      }

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors({ submit: "Failed to update profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:px-8">
            <h2 className="text-3xl font-bold text-white text-center">
              Edit Profile
            </h2>
            <p className="text-blue-100 text-center mt-2">
              Update your information to keep your profile current
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm font-medium">
                {successMessage}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-8 space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full text-black px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.firstName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full text-black px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.lastName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                disabled
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full text-black px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Profile Image Upload */}
            <div>
              <label
                htmlFor="profileImage"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Profile Image
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full text-black px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors border-gray-300"
                />
                {selectedFile && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-800">
                      Selected: {selectedFile.name} (will upload when you update
                      profile)
                    </span>
                  </div>
                )}
                {errors.profileUrl && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.profileUrl}
                  </p>
                )}
                {/* Current or preview image */}
                <div className="mt-3 flex flex-col items-center">
                  <div className="text-xs text-gray-500 mb-2">
                    {imagePreview
                      ? "Preview (will upload when profile is updated)"
                      : "Profile image"}
                  </div>
                  <img
                    src={
                      imagePreview ||
                      formData.profileUrl ||
                      "/default-avatar.svg"
                    }
                    alt="Profile preview"
                    className="h-32 w-32 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                    onError={(e) => {
                      if (
                        e.target.src !==
                        window.location.origin + "/default-avatar.svg"
                      ) {
                        e.target.src = "/default-avatar.svg";
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Gender and Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Select gender</option>
                  <option value="male">male</option>
                  <option value="female">female</option>
                  <option value="other">other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={handleInputChange}
                  className={`w-full text-black px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.age ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Enter your age"
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                )}
              </div>
            </div>

            {/* About */}
            <div>
              <label
                htmlFor="about"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                About Me
              </label>
              <textarea
                id="about"
                name="about"
                rows="4"
                value={formData.about}
                onChange={handleInputChange}
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Tell us about yourself, your interests, and what you're looking for..."
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.about.length}/500 characters
              </p>
            </div>

            {/* Skills */}
            <div>
              <label
                htmlFor="skills"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Skills & Interests
              </label>
              <input
                type="text"
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="JavaScript, React, Node.js, Photography, Travel..."
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate skills with commas
              </p>
            </div>

            {successMessage && (
              <div className="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm font-medium">
                  {successMessage}
                </p>
              </div>
            )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-medium">
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white shadow-lg transition-all duration-200 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating Profile...
                  </div>
                ) : (
                  "Update Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
