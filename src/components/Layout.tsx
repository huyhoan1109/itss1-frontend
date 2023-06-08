import { Header } from "./Header/Header";
import { Footer } from "./Footer/Footer";
import styled from "styled-components"
import {FC, ReactNode} from "react";

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
    return (
        <Wrapper>
            <Header />
                <main className='main'>{children}</main>
            <Footer />
        </Wrapper>
    )
};

export default Layout