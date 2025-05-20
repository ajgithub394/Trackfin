import React, { useContext, useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImage';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [cnfPassword, setCnfPassword] = useState("");

  const [error, setError] = useState(null);
  const {updateUser} = useContext(UserContext);
  const navigate = useNavigate();

  //handling the signup form
  const handleSignUp = async (e) =>{
    e.preventDefault();
    let profileImageUrl = "";
    if(!fullName){
      setError("Please enter your full name");
      return;
    }
    if(!validateEmail(email)){
      setError("Please enter a valid Email");
      return;
    }
    if(!password || password.length < 8){
      setError("Please Enter a valid password...(min 8 characters)");
      return;
    }
    if(cnfPassword != password){
      setError("Passwords don't match !");
      return;
    }
    setError("");

    //sign-up API call
    try{

      //profile image upload
      if(profilePic){
        const imageUploadRes = await uploadImage(profilePic);
        profileImageUrl = imageUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        fullName,
        email,
        password,
        profileImageUrl
      });

      const {token , user} = response.data;
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
      <div className='lg:w[-100%] h-auto mt-10 md:md-0 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black dark:text-[#DDDDDD]'>Create an Account</h3>
        <p className='text-xs text-slate-700 dark:text-slate-300 mt-[5px] mb-6'>
          Join us today by entering your details
        </p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image = {profilePic} setImage = {setProfilePic}/>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

            <Input
              value={fullName}
              onChange={({target}) => setFullName(target.value)}
              label = "Full Name"
              placeholder="John Stenson"
              type = "text"
            />

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

            <Input
              value = {cnfPassword}
              onChange = {({target}) => setCnfPassword(target.value)}
              label = "Confirm your Password"
              placeholder = "Enter your password again"
              type= "password"
            />
          </div>
          {error && <p className='text-red-500'>{error}</p>}
            
          <button className='btn-primary' type='submit'>Create Account</button>
          <p className='text-black dark:text-white'>Already have an account? {" "}
            <Link className='text-blue-600 underline' to="/login">Sign In</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp