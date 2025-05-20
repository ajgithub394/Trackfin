import React, { useRef, useState } from 'react'
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const handleImageChange = (ev) => {
    const file = ev.target.files[0];
    if(file) {
      setImage(file);
      //generate preview Url from the file
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className='flex justify-center mb-6'>
      <input
        type='file'
        accept='image/*'
        ref={inputRef}
        onChange={handleImageChange}
        className='hidden'
      />

      {!image ? (
        <div className='w-20 h-20 flex items-center justify-center bg-purple-100 dark:bg-purple-900 rounded-full relative'>
          <LuUser className='text-4xl text-blue-600' />
          <button 
            type='button' 
            onClick={onChooseFile} 
            className='w-8 h-8 flex items-center justify-center bg-blue-600 text-white dark:text-gray-800 rounded-full absolute -bottom-1 -right-1'
          >
            <LuUpload />
          </button>
        </div>
      ) : (
        <div className='relative'>
          <img
            src={previewUrl}
            alt='profile photo'
            className='w-20 h-20 rounded-full object-cover'
          />
          <button 
            className='w-8 h-8 flex items-center justify-center bg-red-500 text-white dark:text-gray-900 rounded-full absolute -bottom-1 -right-1' 
            type='button' 
            onClick={handleRemoveImage}
          >
            <LuTrash />
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfilePhotoSelector