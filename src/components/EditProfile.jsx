import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { addUser } from '../utils/userSlice';

const EditProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profileUrl: '',
    gender: '',
    age: '',
    about: '',
    skills: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [originalData, setOriginalData] = useState({});

  // Populate form with user data from Redux
  useEffect(() => {
    if (user) {
      const userData = user.message || user;
      const initialData = {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        profileUrl: userData.profileUrl || '',
        gender: userData.gender || '',
        age: userData.age || '',
        about: userData.about || '',
        skills: Array.isArray(userData.skills) ? userData.skills.join(', ') : userData.skills || ''
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Only validate if fields have values - make all fields optional for updates
    if (formData.firstName.trim() && formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }
    
    if (formData.lastName.trim() && formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (formData.email.trim() && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.age && (formData.age < 18 || formData.age > 100)) {
      newErrors.age = 'Age must be between 18 and 100';
    }
    
    if (formData.profileUrl && formData.profileUrl.trim() && !/^https?:\/\/.+/.test(formData.profileUrl)) {
      newErrors.profileUrl = 'Please enter a valid URL starting with http:// or https://';
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
    setSuccessMessage('');
    
    try {
      // Check if any field has actually changed
      const hasChanges = 
        formData.firstName.trim() !== originalData.firstName.trim() ||
        formData.lastName.trim() !== originalData.lastName.trim() ||
        formData.email.trim() !== originalData.email.trim() ||
        formData.profileUrl.trim() !== originalData.profileUrl.trim() ||
        formData.gender !== originalData.gender ||
        formData.age !== originalData.age ||
        formData.about.trim() !== originalData.about.trim() ||
        formData.skills.trim() !== originalData.skills.trim();
      
      if (!hasChanges) {
        setErrors({ submit: 'No changes detected. Please modify at least one field to update your profile.' });
        return;
      }
      
      // Only send fields that have values (partial update)
      const dataToSend = {};
      
      if (formData.firstName.trim()) dataToSend.firstName = formData.firstName.trim();
      if (formData.lastName.trim()) dataToSend.lastName = formData.lastName.trim();
      if (formData.email.trim()) dataToSend.email = formData.email.trim();
      if (formData.profileUrl.trim()) dataToSend.profileUrl = formData.profileUrl.trim();
      if (formData.gender) dataToSend.gender = formData.gender;
      if (formData.age) dataToSend.age = parseInt(formData.age);
      if (formData.about.trim()) dataToSend.about = formData.about.trim();
      if (formData.skills.trim()) {
        dataToSend.skills = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      }
      
      // Check if there's at least one field to update
      if (Object.keys(dataToSend).length === 0) {
        setErrors({ submit: 'Please update at least one field before submitting.' });
        return;
      }
      
      const response = await axios.patch(
        BASE_URL + '/profile/edit',
        dataToSend,
        { withCredentials: true }
      );
      
      // Update Redux store with the updated user data
      const updatedUser = response.data.data || response.data.user || response.data;
      dispatch(addUser(updatedUser));
      
      // Update local form state with the latest data to reflect changes immediately
      if (updatedUser) {
        const userData = updatedUser.message || updatedUser;
        const updatedFormData = {
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || userData.emailId || '',
          profileUrl: userData.profileUrl || '',
          gender: userData.gender || '',
          age: userData.age || '',
          about: userData.about || '',
          skills: Array.isArray(userData.skills) ? userData.skills.join(', ') : userData.skills || ''
        };
        setFormData(updatedFormData);
        setOriginalData(updatedFormData); // Update original data to new values
      }
      
      setSuccessMessage('Profile updated successfully!');
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrors({ submit: 'Failed to update profile. Please try again.' });
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
              <p className="text-green-800 text-sm font-medium">{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-8 space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full text-black px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full text-black px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300'
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Profile URL */}
            <div>
              <label htmlFor="profileUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image URL
              </label>
              <input
                type="url"
                id="profileUrl"
                name="profileUrl"
                value={formData.profileUrl}
                onChange={handleInputChange}
                className={`w-full text-black px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.profileUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="https://example.com/your-photo.jpg"
              />
              {errors.profileUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.profileUrl}</p>
              )}
              {formData.profileUrl && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={formData.profileUrl}
                    alt="Profile preview"
                    className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Gender and Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
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
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
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
                    errors.age ? 'border-red-300 bg-red-50' : 'border-gray-300'
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
              <label htmlFor="about" className="block text-sm font-medium text-gray-700 mb-2">
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
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
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
              <p className="text-green-800 text-sm font-medium">{successMessage}</p>
            </div>
          )}

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm font-medium">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white shadow-lg transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating Profile...
                  </div>
                ) : (
                  'Update Profile'
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