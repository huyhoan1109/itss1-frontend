import "./Header.css";
import { Link, NavLink } from "react-router-dom"
import Logo from "../../assets/images/logo.png";
import { routePath } from '../../routes/routePath'
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";

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

export const Header = () => {
    const { t } = useTranslation()
    const {auth} = useAuth()
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
                            <div className="content-text">
                                {auth?.user?.name}
                            </div>
                            <LanguageSwitcher />
                        </div>
                    }
                </div>
            </div>
        </header>
    );
};
