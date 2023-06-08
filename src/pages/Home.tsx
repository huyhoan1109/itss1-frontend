import { Header } from "../components/Header/Header";
import { Footer } from "../components/Footer/Footer";
import { Sliders } from "../components/Sliders/Sliders";
import Container from "../components/Container";

const HomePage = () => {
    return (
        <div>
            <Container>
                <Sliders />
            </Container>
        </div>
    );
};

export default HomePage