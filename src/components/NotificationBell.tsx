import NotificationsIcon from '@mui/icons-material/Notifications';
import { useEffect, useState } from 'react';
import { Menu, MenuItem, Badge, IconButton, Tooltip } from '@mui/material';
import useNotifications from '../hooks/useNotifications';
import useAuth from '../hooks/useAuth';
import { routePath } from '../routes/routePath';
import { Api } from '../services/api';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const BasicMenu = ({ anchorEl, handleClose, open, menuItems }: any) => {
    const {auth} = useAuth()
    const {t, i18n} = useTranslation()
    return (
        <Menu
            style={{overflowX: "hidden", overflowY: "scroll", height: "5"}}
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
        >
            {menuItems.map((item:any, index:any) => (
                <MenuItem
                    key={index}
                    onClick={handleClose}
                >
                    {i18n.language == 'jp' && 
                        ((auth.user.role == 'teacher' &&
                            <a>{t('content.student')}{item.name}が登録しました</a>   
                        )|| 
                        (auth.user.role == 'student' && (item.status.localeCompare("wait") != 0) &&
                            <Link to={routePath.teacher.view(item.teacherID)}>{t('content.teacher')}{item.name}が{t(`content.${item.status}`)}しました</Link>
                        ))
                    }
                    {i18n.language == 'vi' && 
                        ((auth.user.role == 'teacher' &&
                            <a>{t('content.student')} {item.name} vừa đăng ký</a>   
                        )|| 
                        (auth.user.role == 'student' && (item.status.localeCompare("wait") != 0) &&
                            <a>{t('content.teacher')} {item.name} đã {t(`content.${item.status}`)}</a>
                        ))
                    }
                </MenuItem>
            ))}
        </Menu>
    )
}

const NotificationBell = ({ iconColor }:any) => {
    const {auth} = useAuth()
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<any>(null);
    const {notifications, setNotifications} = useNotifications()
    const [length, setLength] = useState(0)
    
    useEffect(() => {
        Api({
            method: 'GET',
            url: routePath.user.matching,
            headers: {
                Authorization: `Bearer ${auth.token}`
            },
        }).then((res) => {
            let result = res.data.data
            let wait_count = 0
            result.forEach((value:any) => {
                if(value.status.localeCompare("wait") == 0){
                    wait_count += 1
                }
            })
            if (auth.user.role == 'student') {
                setLength(result.length - wait_count)
            } else {
                setLength(wait_count)
            }
            setNotifications(res.data.data)
        })
    }, [])

    const handleOpen = (event: any) => {
        setAnchorEl(event.currentTarget)
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Tooltip title={""}>
                <IconButton
                    color={iconColor}
                    onClick={(e) => 
                        {
                            handleOpen(e)
                        }
                    }
                >
                    <Badge
                        badgeContent={length}
                        color="error"
                    >
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Tooltip>
            <BasicMenu
                open={open}
                anchorEl={anchorEl}
                handleClose={handleClose}
                menuItems={notifications}
            />
        </div>
    )
}

export default NotificationBell