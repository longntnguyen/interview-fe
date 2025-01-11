import "./App.scss";
import { SwapCoin } from "./containers/SwapCoin";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { NotifyProvider } from "./providers/NotifyProvider";

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "30px", // Set your desired border radius here
        },
      },
    },
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <NotifyProvider>
          <SwapCoin />
        </NotifyProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
