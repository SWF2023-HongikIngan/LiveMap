// import * as React from "react";
// import MenuIcon from "@mui/icons-material/Menu";
// import AppBar from "@mui/material/AppBar";
// import Box from "@mui/material/Box";
// import IconButton from "@mui/material/IconButton";
// import Toolbar from "@mui/material/Toolbar";
// import { ConnectButton } from "@rainbow-me/rainbowkit";
// import { Bars3Icon, BugAntIcon, MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
// import { rgba } from "polished";
import * as React from "react";
import AppBar, { AppBarProps } from "@mui/material/AppBar";
import Box, { BoxProps } from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Bars3Icon } from "@heroicons/react/24/outline";


export default function ResponsiveDrawer() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box>
      <AppBar
        sx={{
          width: { sm: `100%` },

          background: "rgba(255, 255, 255, 0.1)",
          boxShadow: `0 8px 32px 0 rgba(255, 255, 255, 0.17)`,
          backdropFilter: `blur(20px)`,
          WebkitBackdropFilter: `blur(20px)`,
          border: `1px solid rgba(255, 255, 255, 0.18)`,
          color: "white",
          padding: 0,
        //   borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}></Box>
          <ConnectButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
