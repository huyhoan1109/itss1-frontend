import Slider1 from './slider1/Slider1'
import Slider2 from "./slider2/Slider2"
import Slider3 from "./slider3/Slider3"
import './Sliders.css'

export const Sliders = () => {
    return (
        <div className="slider-components">
            <div className="component-image"><Slider1 /></div>
            <div className="component-content"><Slider2 /></div>   
            <div className="component-image"><Slider3 /></div>           
        </div>
    );
};
