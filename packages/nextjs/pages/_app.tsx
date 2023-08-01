import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import MyTheme from "../utils/theme";
import { ThemeProvider } from "@mui/material";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import NextNProgress from "nextjs-progressbar";
import "swiper/css";
import { useDarkMode } from "usehooks-ts";
import { WagmiConfig } from "wagmi";
import Appbar from "~~/components/Appbar";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { useGlobalState } from "~~/services/store/store";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";
import { appChains } from "~~/services/web3/wagmiConnectors";
import "~~/styles/globals.css";

const ScaffoldEthApp = ({ Component, pageProps }: AppProps) => {
  const price = useNativeCurrencyPrice();
  const setNativeCurrencyPrice = useGlobalState(state => state.setNativeCurrencyPrice);
  // This variable is required for initial client side rendering of correct theme for RainbowKit
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    if (price > 0) {
      setNativeCurrencyPrice(price);
    }
  }, [setNativeCurrencyPrice, price]);

  useEffect(() => {
    setIsDarkTheme(isDarkMode);
  }, [isDarkMode]);

  return (
    <ThemeProvider theme={MyTheme}>
      <WagmiConfig config={wagmiConfig}>
        <NextNProgress />
        <RainbowKitProvider
          chains={appChains.chains}
          avatar={BlockieAvatar}
          theme={
            isDarkTheme
              ? darkTheme({
                  accentColor: "#000",
                })
              : lightTheme({
                  accentColor: "#000",
                })
          }
        >
          <div>
            <Appbar />
            <main>
              <Component {...pageProps} />
            </main>
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
    </ThemeProvider>
  );
};

export default ScaffoldEthApp;
