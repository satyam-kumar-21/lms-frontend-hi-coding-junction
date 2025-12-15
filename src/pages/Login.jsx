import React, { useState } from 'react';
import logo from '../assets/logo.jpg';
import google from '../assets/google.jpg';
import axios from 'axios';
import { serverUrl } from '../App';
import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ---------------- FETCH CURRENT USER ----------------
  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/user/currentuser`, { withCredentials: true });
      dispatch(setUserData(res.data));
    } catch (err) {
      console.log("Fetch current user error:", err);
    }
  };

  // ---------------- LOGIN ----------------
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true } // ✅ Cross-domain cookie
      );

      // first set partial login data
      dispatch(setUserData(result.data));

      // fetch full user data (enrolledCourses, etc)
      await fetchCurrentUser();

      navigate("/");
      toast.success("Login Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- GOOGLE LOGIN ----------------
  const googleLogin = async () => {
    setLoading(true);
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      const name = user.displayName;
      const email = user.email;
      const role = ""; // default role

      const result = await axios.post(
        `${serverUrl}/api/auth/googlesignup`,
        { name, email, role },
        { withCredentials: true } // ✅ Cross-domain cookie
      );

      dispatch(setUserData(result.data));

      // fetch full user data after Google login
      await fetchCurrentUser();

      navigate("/");
      toast.success("Login Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-[#dddbdb] w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3'>
      <form
        className='w-[90%] md:w-200 h-150 bg-white shadow-xl rounded-2xl flex'
        onSubmit={(e) => e.preventDefault()}
      >
        {/* LEFT SIDE */}
        <div className='md:w-[50%] w-[100%] h-[100%] flex flex-col items-center justify-center gap-4'>
          <div>
            <h1 className='font-semibold text-black text-2xl'>Welcome back</h1>
            <h2 className='text-[#999797] text-[18px]'>Login to your account</h2>
          </div>

          {/* EMAIL INPUT */}
          <div className='flex flex-col gap-1 w-[85%] items-start justify-center px-3'>
            <label htmlFor="email" className='font-semibold'>Email</label>
            <input
              id='email'
              type="text"
              className='border w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]'
              placeholder='Your email'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              disabled={loading}
            />
          </div>

          {/* PASSWORD INPUT */}
          <div className='flex flex-col gap-1 w-[85%] items-start justify-center px-3 relative'>
            <label htmlFor="password" className='font-semibold'>Password</label>
            <input
              id='password'
              type={show ? "text" : "password"}
              className='border w-[100%] h-[35px] border-[#e7e6e6] text-[15px] px-[20px]'
              placeholder='***********'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              disabled={loading}
            />
            {!show &&
              <MdOutlineRemoveRedEye
                className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]'
                onClick={() => setShow(prev => !prev)}
              />}
            {show &&
              <MdRemoveRedEye
                className='absolute w-[20px] h-[20px] cursor-pointer right-[5%] bottom-[10%]'
                onClick={() => setShow(prev => !prev)}
              />}
          </div>

          {/* LOGIN BUTTON */}
          <button
            className='w-[80%] h-[40px] bg-black text-white cursor-pointer flex items-center justify-center rounded-[5px]'
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? <ClipLoader size={30} color='white' /> : "Login"}
          </button>

          <span
            className='text-[13px] cursor-pointer text-[#585757]'
            onClick={() => navigate("/forgotpassword")}
          >
            Forget your password?
          </span>

          {/* OR CONTINUE WITH */}
          <div className='w-[80%] flex items-center gap-2'>
            <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
            <div className='w-[50%] text-[15px] text-[#999797] flex items-center justify-center'>Or continue with</div>
            <div className='w-[25%] h-[0.5px] bg-[#c4c4c4]'></div>
          </div>

          {/* GOOGLE LOGIN */}
          <div
            className='w-[80%] h-[40px] border border-[#d3d2d2] rounded-[5px] flex items-center justify-center cursor-pointer'
            onClick={googleLogin}
          >
            <img src={google} alt="Google" className='w-[25px]' />
            <span className='text-[18px] text-gray-500 ml-2'>Google</span>
          </div>

          <div className='text-[#6f6f6f]'>
            Don't have an account?{" "}
            <span
              className='underline underline-offset-1 text-black cursor-pointer'
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className='w-[50%] h-[100%] rounded-r-2xl bg-black md:flex items-center justify-center flex-col hidden'>
          <img src={logo} className='w-30 shadow-2xl' alt="Logo" />
          <span className='text-white text-2xl mt-4'>Hi-Coding Junction</span>
        </div>
      </form>
    </div>
  );
}

export default Login;
