import "./Header.css";
import { Link, NavLink, useNavigate } from "react-router-dom"
import Logo from "../../assets/images/logo.png";
import { routePath } from '../../routes/routePath'
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";
import { Dropdown, notification, MenuProps } from "antd";
import user_image from '../../assets/images/user.png'
import { useEffect, useState } from "react";
import NotificationBell from "../NotificationBell";

function LanguageSwitcher(){
    const { t, i18n } = useTranslation();
    return (
        <div className="language-menu">
            <select className="language-select"
                value={i18n.language}
                onChange={(e) =>
                    i18n.changeLanguage(e.target.value)
                }
            >
                <option value="jp">{t('content.japanese')}</option>
                <option value="vi">{t('content.vietnamese')}</option>
            </select>
        </div>
    )
}

export const Header = ({handleToggle}: any) => {
    let navigate = useNavigate()
    const { t } = useTranslation()
    const {auth, setAuth} = useAuth()
    const handleLogout = () => {
        setAuth({})
        notification.success({
            duration: 1,
            message: t('message.goodbye')
        })
    }

    const teacher_items: MenuProps['items'] = [
        {
            key: '1',
            label: <div>{t('content.profile')}</div>,
        },
        {
            key: '2',
            label: <div>{t('content.your_student')}</div>
        },
        {
            key: '3',
            label: <div>{t('content.logout')}</div>,
        },
    ]

    const user_items: MenuProps['items'] = [
        {
            key: '1',
            label: <div>{t('content.profile')}</div>,
        },
        {
            key: '2',
            label: <div>{t('content.logout')}</div>,
        },
    ]

    const [menu_items, setMenuItems] = useState<any>(user_items)

    useEffect(() => {
        if(auth?.user?.role == 'teacher') {
            setMenuItems(teacher_items)      
        } 
    }, [])

    const onClickToggle: MenuProps['onClick'] = (e) => {
        switch(e.key) {
            case '1':
                return navigate(routePath.user.base)
            case '2':
                if(auth.user.role == 'teacher') {
                    return navigate(routePath.teacher.allStudents)
                }
                else {
                    handleLogout();
                }
                break
            case '3':
                handleLogout();
                break
        }
    }

    return (
        <header className="header">
            <div className="scontainer flex">
                <div className="logo">
                    <h1>
                        <Link 
                            className="logo-text" 
                            style={{ textDecoration: 'none' }} 
                            to={routePath.home}
                        >
                            SaGaSuy
                        </Link>
                    </h1>
                    <Link 
                        to={routePath.home}
                    >
                        <img src={Logo} alt="logo" width="50px" />
                    </Link>
                    {
                        !auth?.user &&
                        <div className="header-content">
                            <div className="content-text">
                                <NavLink to={routePath.auth.signup} className={({ isActive }) => (isActive ? 'active' : '')}>
                                    <button className="astext">{t('content.signup')} </button>
                                </NavLink>
                            </div>
                            <div className="content-text">
                                <NavLink to={routePath.auth.login} className={({ isActive }) => (isActive ? 'active' : '')}>
                                    <button className="astext">{t('content.login')} </button>
                                </NavLink>
                            </div>
                            <LanguageSwitcher />
                        </div>
                    }
                    {
                        auth?.user &&
                        <div className="header-content">
                            <NotificationBell />
                            <div className="content-text" style={{fontSize: 18}}>
                                {auth.user.name}
                            </div>
                            {auth.user.avatar &&
                                <Dropdown menu={{ items: menu_items, onClick:onClickToggle }}>
                                    <img 
                                        src={auth.user.avatar}
                                        className='w-10 h-10 object-cover rounded-full border border-solid border-gray-500'
                                        alt=''
                                        style={{marginRight: "2%"}}
                                        onError={({ currentTarget }) => {
                                            currentTarget.onerror = null; // prevents looping
                                            currentTarget.src = user_image
                                        }}
                                    />
                                </Dropdown>
                            }
                            {!auth.user.avatar &&
                                <Dropdown menu={{ items: menu_items, onClick:onClickToggle }}>
                                <img 
                                    src={user_image}
                                    className='w-10 h-10 object-cover rounded-full border border-solid border-gray-500'
                                    alt=''
                                    style={{marginRight: 20}}
                                />
                                </Dropdown>
                            }
                            <LanguageSwitcher />
                        </div>
                    }
                </div>
            </div>
        </header>
    );
};
