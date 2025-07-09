import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "./Header/Header";
import NavigationBar from "./NavigationBar/NavigationBar";

const Layout: React.FC = () => {
  const [headerInputValue, setHeaderInputValue] = useState("");
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isworksheetPage = location.pathname === "/planilhas";
  const isSuspectsPage = location.pathname === "/alvos";
  const isOperationsPage = location.pathname === "/operacoes";

  const toggleNavigation = () => {
    setIsMenuCollapsed(!isMenuCollapsed);
  };

  return (
    <Box
      width="100%"
      display="flex"
      flexDirection="column"
      height="100vh"
      overflow="hidden"
      maxWidth={"2000px"}
      mx="auto"
    >
      <Box display={"flex"} height={"100%"} flex={1}>
        {!isLoginPage && (
          <NavigationBar
            isCollapsed={isMenuCollapsed}
            onToggle={toggleNavigation}
          />
        )}
        <Box display="flex" flexDirection="column" flex="1" overflow="hidden">
          {(isSuspectsPage || isOperationsPage || isworksheetPage) && (
            <Header
              inputValue={headerInputValue}
              setInputValue={setHeaderInputValue}
            />
          )}

          <Box
            display={"flex"}
            flex={1}
            flexDirection={"column"}
            height={"100%"}
            overflow={"auto"}
          >
            <Outlet context={{ headerInputValue, setHeaderInputValue }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
