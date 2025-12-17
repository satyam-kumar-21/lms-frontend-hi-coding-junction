import axios from 'axios'
import React, { useState } from 'react'
import { FaArrowLeft } from "react-icons/fa"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { serverUrl } from '../../App'
import { setLectureData } from '../../redux/lectureSlice'
import { toast } from 'react-toastify'
import { ClipLoader } from 'react-spinners'

function EditLecture() {

  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)

  const { courseId, lectureId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { lectureData } = useSelector(state => state.lecture)
  const selectedLecture = lectureData.find(l => l._id === lectureId)

  const [lectureTitle, setLectureTitle] = useState(selectedLecture?.lectureTitle || "")
  const [videoFile, setVideoFile] = useState(null)
  const [isPreviewFree, setIsPreviewFree] = useState(false)

  // ✅ CREATE FORMDATA INSIDE FUNCTION
  const editLecture = async () => {
    if (!lectureTitle) {
      return toast.error("Lecture title required")
    }

    if (!videoFile) {
      return toast.error("Please select a video")
    }


    const formData = new FormData()
    formData.append("lectureTitle", lectureTitle)
    formData.append("videoUrl", videoFile)
    formData.append("isPreviewFree", isPreviewFree)



    setLoading(true)

    try {
      const res = await axios.post(
        `${serverUrl}/api/course/editlecture/${lectureId}`,
        formData,
        {
          withCredentials: true // ✅ bas itna hi
        }
      );



      console.log("res", res)

      dispatch(setLectureData(res.data))
      toast.success("Lecture Updated")
      navigate("/courses")

    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Upload failed")
    } finally {
      setLoading(false)
    }
  }

  const removeLecture = async () => {
    setLoading1(true)

    try {
      await axios.delete(
        `${serverUrl}/api/course/removelecture/${lectureId}`,
        { withCredentials: true }
      )

      toast.success("Lecture Removed")
      navigate(`/createlecture/${courseId}`)

    } catch (err) {
      console.error(err)
      toast.error("Lecture remove error")
    } finally {
      setLoading1(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6">

        <div className="flex items-center gap-2 mb-2">
          <FaArrowLeft
            className="text-gray-600 cursor-pointer"
            onClick={() => navigate(`/createlecture/${courseId}`)}
          />
          <h2 className="text-xl font-semibold text-gray-800">
            Update Your Lecture
          </h2>
        </div>

        <button
          className="px-4 py-2 bg-red-600 text-white rounded-md"
          disabled={loading1}
          onClick={removeLecture}
        >
          {loading1 ? <ClipLoader size={20} color="white" /> : "Remove Lecture"}
        </button>

        <div className="space-y-4">

          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              type="text"
              className="w-full p-3 border rounded-md"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Video *</label>
            <input
              type="file"
              accept="video/*"
              className="w-full border rounded-md p-2"
              onChange={(e) => setVideoFile(e.target.files[0])}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              className="accent-black h-4 w-4"
              checked={isPreviewFree}
              onChange={() => setIsPreviewFree(prev => !prev)}
            />
            <label className="text-sm">Is this video FREE</label>
          </div>

        </div>

        {loading && <p className="text-sm">Uploading video… please wait</p>}

        <button
          className="w-full bg-black text-white py-3 rounded-md"
          disabled={loading}
          onClick={editLecture}
        >
          {loading ? <ClipLoader size={25} color="white" /> : "Update Lecture"}
        </button>

      </div>
    </div>
  )
}

export default EditLecture
