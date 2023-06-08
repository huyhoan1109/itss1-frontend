import { styled } from "styled-components";

const Loader = () => {
  return (
    <Wrapper>
        <div className='bg-blue'>
            <div className="loader"></div>
        </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
    position: fixed; 
    top: 30%; 
    left: 45%;

    .loader {
        border: 16px solid #f3f3f3;
        border-top: 16px solid #3498db;
        border-radius: 50%;
        width: 130px;
        height: 130px;
        animation: spin 2s linear infinite;
    }

    @keyframes spin {
        0%  { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`

export default Loader;