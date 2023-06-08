import "./Slider2.css";
import { BsSearch } from "react-icons/bs";
import {IconContext} from "react-icons"
import { useTranslation } from 'react-i18next';
import { routePath } from "../../../routes/routePath";
import { Link } from "react-router-dom";

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
            <div>
                <h2 className="jp-font-subtitle">{t('content.slider_note2')}</h2>
            </div>
            <Link to={routePath.searchTeacher}>
                <button className="colorButton">{t('content.slider_note3')}
                    <SearchIcon />
            </button>
            </Link>
        </div>
    );
};

export default Slider2