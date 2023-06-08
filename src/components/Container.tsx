import { FC, HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
}

const Container: FC<ContainerProps> = ({ children, ...props }) => {
    return <Wrapper {...props}>{children}</Wrapper>
}
const Wrapper = styled.div`
    max-width: 1466px;
    margin: 0 auto;
    padding-left: 24px;
    padding-right: 24px;
`

export default Container