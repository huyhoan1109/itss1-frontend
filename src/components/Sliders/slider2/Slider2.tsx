import "./Slider2.css";
import { BsSearch } from "react-icons/bs";
import {IconContext} from "react-icons"
import { useTranslation } from 'react-i18next';
import { routePath } from "../../../routes/routePath";
import { Link } from "react-router-dom";
import image from "../../../assets/images/pic4.png";


function SearchIcon() {
    return (
        <IconContext.Provider value={{ color: 'white'}}>
            <BsSearch />
        </IconContext.Provider>
    );
}

const Slider2 = () => {
    const { t } = useTranslation()
    return (
        <div className="contents">
            <div className="jp-font">
                <h1 className="jp-font-title">{t('content.slider_note1')}</h1>
            </div>
            <h2 className="jp-font-subtitle">{t('content.slider_note2')}</h2>
            <Link to={routePath.allTeachers} >
                <button className="colorButton" style={{ display: "flex"}}>
                    <div className="button-content">
                        {t('content.slider_note3')}
                    </div>
                    <div className="button-content">
                        <SearchIcon />
                    </div>
                </button>
            </Link>
            <img style={{margin: "auto", marginTop: 20}} src={image} alt="anh4" sizes="80%"/>
        </div>
    );
};

export default Slider2