import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

function EnrolledCourse() {
  const navigate = useNavigate();

  const { userData } = useSelector((state) => state.user);

  // ⛔ Guard: userData not ready yet
  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading your courses...</p>
      </div>
    );
  }

  const enrolledCourses = userData.enrolledCourses || [];

  return (
    <div className="min-h-screen w-full px-4 py-9 bg-gray-50">
      <FaArrowLeftLong
        className="absolute top-[3%] md:top-[6%] left-[5%] w-[22px] h-[22px] cursor-pointer"
        onClick={() => navigate("/")}
      />

      <h1 className="text-3xl text-center font-bold text-gray-800 mb-6">
        My Enrolled Courses
      </h1>

      {enrolledCourses.length === 0 ? (
        <p className="text-gray-500 text-center w-full">
          You haven’t enrolled in any course yet.
        </p>
      ) : (
        <div className="flex items-center justify-center flex-wrap gap-[30px]">
          {enrolledCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border w-[280px]"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {course.title}
                </h2>
                <p className="text-sm text-gray-600 mb-2">
                  {course.category}
                </p>
                <p className="text-sm text-gray-700">
                  {course.level}
                </p>

                <button
                  className="w-full mt-3 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-700"
                  onClick={() => navigate(`/viewlecture/${course._id}`)}
                >
                  Watch Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EnrolledCourse;
