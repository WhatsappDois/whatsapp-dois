import { useContext } from 'react';

import { Dialog, Typography, List, ListItem, Box, styled } from '@mui/material';

import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

import { addUser } from '../../service/api';
import { AccountContext } from '../../context/AccountProvider';

const Component = styled(Box)`
    display: flex; 
`;

const Container = styled(Box)`
    padding: 56px 0 56px 56px;
`;

const Title = styled(Typography)`
    font-size: 26px;
    margin-bottom: 25px;
    color: #525252;
    font-family: Segoe UI,Helvetica Neue,Helvetica,Lucida Grande,Arial,Ubuntu,Cantarell,Fira Sans,sans-serif;
    font-weight: 300;
`;

const StyledList = styled(List)`
    &  > li {
        padding: 0;
        margin-top: 15px;
        font-size: 18px;
        line-height: 28px;
        color: #4a4a4a;
    }
`;

const dialogStyle = {
    marginTop: '12%',
    height: '95%',
    width: '60%',
    maxWidth: '100',
    maxHeight: '100%',
    borderRadius: 0,
    boxShadow: 'none',
    overflow: 'hidden'
}

const LoginDialog = () => {

    const { setAccount,showloginButton, setShowloginButton } = useContext(AccountContext);

    const onLoginSuccess = async (res) => {
        let decoded = jwtDecode(res.credential);
        setAccount(decoded);
        setShowloginButton(false);
        await addUser(decoded);
    };

    const onLoginFailure = (res) => {
        console.log('Login Failed:', res);
    };

    return (
        <Dialog
            open={true}
            BackdropProps={{style: {backgroundColor: 'unset'}}}
            maxWidth={'md'}
            PaperProps={{ sx: dialogStyle }}
        >
            <Component>
                <Container>
                    <Title>Para usar WhatsApp Dois no seu computador:</Title>
                    <StyledList>
                        <ListItem>1. Faça login com uma conta do Google</ListItem>
                        <ListItem>2. Respeite os outros usuários</ListItem>
                        <ListItem>3. Se divirta!</ListItem>
                    </StyledList>
                </Container>
                <Box style={{position:'relative'}}>
                    <Box style={{position: 'absolute', top: '50%', transform: 'translateX(25%) translateY(-25%)'}}>
                        { showloginButton ?
                            <GoogleLogin
                                buttonText=""
                                onSuccess={onLoginSuccess}
                                onError={onLoginFailure}
                            /> : null}
                    </Box>
                </Box>
            </Component>
        </Dialog>
    )
}

export default LoginDialog;