import { Header } from "./Header/Header";
import { Footer } from "./Footer/Footer";
import styled from "styled-components"
import {useState, FC, ReactNode} from "react";


const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  & > main {
    flex: 1;
  }
`
interface LayoutProps {
    children: ReactNode
}

const Layout:FC<LayoutProps> = ({children}) => {
    const [isActive, setActive] = useState<any>(false);

    const handleToggle = () => {
        setActive(!isActive);
    }
    return (
        <Wrapper>
            <Header handleToggle={handleToggle} />
                {
                    isActive && (
                        <div className="fixed">Hello</div>
                    )
                }
                <main className='main'>
                    {/* <div className="border"> */}
                        {children}
                    {/* </div> */}
                </main>
            <Footer />
        </Wrapper>
    )
};

export default Layout