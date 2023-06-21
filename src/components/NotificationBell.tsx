import NotificationsIcon from '@mui/icons-material/Notifications';
import { useEffect, useState } from 'react';
import { Menu, MenuItem, Badge, IconButton, Tooltip } from '@mui/material';
import useNotifications from '../hooks/useNotifications';
import useAuth from '../hooks/useAuth';
import { routePath } from '../routes/routePath';
import { Api } from '../services/api';
import { useTranslation } from 'react-i18next';

const BasicMenu = ({ anchorEl, handleClose, open, menuItems }: any) => {
    const {auth} = useAuth()
    const {t, i18n} = useTranslation()
    return (
        <Menu
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
                            <a>{t('content.tutor')}{item.name}</a>
                        ))
                    }
                    {i18n.language == 'vi' && 
                        ((auth.user.role == 'teacher' && 
                            <a>{t('content.student')}{item.name} vừa đăng ký</a>   
                        )|| 
                        (auth.user.role == 'student' && (item.status.localeCompare("wait") != 0) &&
                            <a>{t('content.tutor')}{item.name}</a>
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
        let count = 0
        Api({
            method: 'GET',
            url: routePath.user.matching,
            headers: {
                Authorization: `Bearer ${auth.token}`
            },
        }).then((res) => {
            if (auth.user.role == 'student') {
                let count = 0
                res.data.data.forEach((value:any) => {
                    if(value.status.localeCompare("wait") != 0){
                        count += 1
                    }
                })
                setLength(count)
            }
            else setLength(res.data.data.length)
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
                    onClick={handleOpen}
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