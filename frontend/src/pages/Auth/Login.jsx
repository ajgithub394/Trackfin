import React, { useContext, useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from "../../utils/axiosInstance";
import { UserContext } from '../../context/userContext';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const {updateUser} = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogin = async (e) =>{
    e.preventDefault();
    if(!validateEmail(email)){
      setError("Please enter a valid email id");
      return;
    }
    if(!password){
      setError("Please enter password");
      return;
    }

    setError("");

    //Login API call
    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
        email,
        password,
      });
      const {token,user} = response.data;
      if(token){
        localStorage.setItem("token",token);
        updateUser(user);
        navigate("/dashboard");
      }
    }catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message);
      }
      else{
        setError("Something went wrong...please try again");
      }
    }
  }

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black dark:text-[#DDDDDD]'>Welcome Back!</h3>
        <p className='text-xs text-slate-700 dark:text-slate-300 mt-[5px] mb-6'>Please Login to continue</p>

        <form onSubmit={handleLogin}>
          <Input
          value = {email}
          onChange = {({target}) => setEmail(target.value)}
          label = "Enter your Email Address"
          placeholder = "hello@gmail.com"
          type= "text"
          />

          <Input
          value = {password}
          onChange = {({target}) => setPassword(target.value)}
          label = "Enter your Password"
          placeholder = "Min 8 characters"
          type= "password"
          />

          {error && <p className='text-red-500'>{error}</p>}

          <button className='btn-primary' type='submit'>LOGIN</button>
          <p className='text-black dark:text-white'>Don't have an account? {" "}
            <Link className='text-blue-600 underline' to="/signUp">Sign Up</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login