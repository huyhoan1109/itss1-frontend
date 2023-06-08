import "./Header.css";
import styled from "styled-components"
import { Link, NavLink } from "react-router-dom"
import Logo from "../../assets/images/logo.png";
import { routePath } from '../../routes/routePath'
import { useTranslation } from "react-i18next";

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
                    <div className="header-content">
                        <div>
                            <NavLink to={routePath.signup} className={({ isActive }) => (isActive ? 'active' : '')}>
                                {t('content.signup')}
                            </NavLink>
                        </div>
                        <div>
                            <NavLink to={routePath.login} className={({ isActive }) => (isActive ? 'active' : '')}>
                                {t('content.login')}
                            </NavLink>
                        </div>
                            <LanguageSwitcher />
                    </div>
                </div>
            </div>
        </header>      
    );
};
