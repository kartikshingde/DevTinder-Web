import React from "react";

const UserCard = ({ user }) => {
  const { firstName, lastName, profileUrl, age, gender, about, skills } = user;

  return (
    <div className="w-full max-w-sm bg-gray-900 text-white rounded-xl shadow-lg overflow-hidden flex flex-col">
      {/* Profile Image */}
      <div className="w-full h-64 bg-gray-800">
        <img
          src={profileUrl}
          alt={firstName + " " + lastName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-grow p-5">
        <h2 className="text-xl font-semibold">
          {firstName} {lastName}
        </h2>

        {age && gender && (
          <p className="text-sm text-gray-400 mt-1">
            {age} yrs • {gender}
          </p>
        )}

        <p className="text-sm text-gray-300 mt-3">{about}</p>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-200"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 justify-center">
          <button className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-sm font-medium">
            Ignore
          </button>
          <button className="flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition text-sm font-medium">
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
