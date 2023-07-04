import user_image from '../assets/images/user.png'
import { FC, useEffect, useState } from 'react';
interface AvatarProps {
    avatar?: string;
    size?: string;
}
const RenderAvatar :FC<AvatarProps> = ({avatar, size="large"}) => {
    const [w_h, setWH] = useState('w-36 h-36')
    useEffect(() => {
        switch (size) {
            case 'large':
                setWH('w-36 h-36')
                break
            case 'middle':
                setWH('w-18 h-18')
                break
            case 'small':
                setWH('w-12 h-12')
                break
                
        }
    }, [size])
    return (
        <div className='flex justify-center items-start'>
        {avatar != null &&
            <img 
                style={{resize: 'inherit'}}
                src={avatar }
                className={`${w_h} object-cover rounded-full border border-solid border-gray-500`}
                alt=''
                onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = user_image
                }}
            />
        } 
        {avatar  == null &&
            <img 
                style={{resize: 'inherit'}}
                src={user_image}
                className={`${w_h} object-cover rounded-full border border-solid border-gray-500`}
                alt=''
            />
        }  
        </div>
    )
}

export default RenderAvatar