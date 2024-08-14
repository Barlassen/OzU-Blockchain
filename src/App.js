import React, { useState } from 'react';
import { ethers } from 'ethers';
import {
  Container,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  CssBaseline,
  Grid,
  Paper,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Akıllı sözleşme ABI ve adresi
const CONTRACT_ADDRESS = '0xYourContractAddress';
const CONTRACT_ABI = [
  // ABI'yi buraya yapıştırın
];

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#ff4081',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [description, setDescription] = useState('');
  const [tokenURI, setTokenURI] = useState('');
  const [value, setValue] = useState(0);
  const [notification, setNotification] = useState('');

  // Cüzdanı bağlama
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );

        setAccount(accounts[0]);
        setContract(contractInstance);
        setNotification('Cüzdan başarıyla bağlandı!');
      } catch (error) {
        console.error(error);
        setNotification('Cüzdan bağlanamadı.');
      }
    } else {
      setNotification('Lütfen MetaMask yüklü bir tarayıcı kullanın.');
    }
  };

  // NFT mintleme
  const mintNFT = async () => {
    if (contract) {
      try {
        const tx = await contract.mintToken(
          account,
          description,
          tokenURI,
          value
        );
        await tx.wait();
        setNotification('NFT başarıyla mint edildi!');
      } catch (error) {
        console.error(error);
        setNotification('NFT mint edilemedi.');
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Sports NFT Platform
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" style={{ marginTop: '30px' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Cüzdan Bağlantısı
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={connectWallet}
                >
                  {account ? `Bağlı: ${account}` : 'Cüzdanı Bağla'}
                </Button>
                {notification && (
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    style={{ marginTop: '10px' }}
                  >
                    {notification}
                  </Typography>
                )}
              </CardContent>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper elevation={3}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  NFT Mintleme
                </Typography>
                <TextField
                  label="Açıklama"
                  fullWidth
                  margin="normal"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                  label="Token URI"
                  fullWidth
                  margin="normal"
                  value={tokenURI}
                  onChange={(e) => setTokenURI(e.target.value)}
                />
                <TextField
                  label="Değer"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={mintNFT}
                  style={{ marginTop: '10px' }}
                >
                  NFT Mintle
                </Button>
              </CardContent>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default App;
