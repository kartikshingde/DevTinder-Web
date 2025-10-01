import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      console.log(res.data.data);
      dispatch(addConnections(res.data.data));
    } catch (err) {
      //Error
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return;

  if (connections.length === 0)
    return <h1 className="text-bold text-3xl">No Connections Found</h1>;

  return (
    <div className="my-10">
      <h1 className="text-center text-bold text-3xl mb-8">Connections</h1>

      <div className="flex flex-wrap justify-center gap-6">
        {connections.map((connection, idx) => {
          const {
            firstName,
            lastName,
            profileUrl,
            age,
            gender,
            about,
            skills,
          } = connection;

          const normalizedSkills = Array.isArray(skills)
            ? skills
            : typeof skills === "string"
            ? skills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [];

          return (
            <div
              key={idx}
              className="w-72 bg-gray-900 text-white rounded-xl shadow-lg overflow-hidden flex flex-col"
            >
              {/* Profile Image */}
              <div className="w-full h-48 bg-gray-800">
                <img
                  src={profileUrl || "/default-avatar.svg"}
                  alt={firstName + " " + lastName}
                  className="w-full h-full object-contain"
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
                {normalizedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {normalizedSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
