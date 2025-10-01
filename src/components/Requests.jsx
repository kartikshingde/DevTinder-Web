import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "../utils/requestSlice";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const fetchRequest = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
    //   console.log(res.data.data);
      dispatch(addRequests(res.data.data));
    } catch (err) {
      //Error
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

  if (!requests) return;

  if (requests.length === 0)
    return <h1 className="text-bold text-3xl">No Requests Found</h1>;

  return (
    <div className="my-10">
      <h1 className="text-center text-bold text-3xl mb-8">Requests</h1>

      <div className="flex flex-wrap justify-center gap-6">
        {requests.map((request, idx) => {
          const {
            firstName,
            lastName,
            profileUrl,
            age,
            gender,
            about,
            skills,
          } = request.fromUserId;

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
                <div className="flex gap-3 mt-6 justify-center">
                  <button className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-sm font-medium">
                    Reject
                  </button>
                  <button className="flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-700 transition text-sm font-medium">
                    Accept
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
