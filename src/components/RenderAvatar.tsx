import user_image from '../assets/images/user.png'
import { FC } from 'react';
const RenderAvatar :FC<{avatar: string}> = ({avatar}) => {
    return (
        <div className='flex justify-center items-start'>
        {avatar != null &&
            <img 
                src={avatar}
                className='w-36 h-36 object-cover rounded-full border border-solid border-gray-500'
                alt=''
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = user_image
                }}
            />
        } 
        {avatar == null &&
            <img 
                src={user_image}
                className='w-36 h-36 object-cover rounded-full border border-solid border-gray-500'
                alt=''
            />
        }  
        </div>
    )
}

export default RenderAvatar