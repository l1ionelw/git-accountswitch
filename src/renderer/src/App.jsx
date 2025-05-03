import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Homepage from "./components/onboarding/Homepage";
import GenerateSSHToken from "./components/generate_ssh_token/GenerateSSHToken";
import Dashboard from "./components/dashboard/Dashboard";
import { ConfigContext } from "./ConfigContext";
import Settings from "./components/settings/Settings";

export default function App() {
  const { config, setConfig } = useContext(ConfigContext);

  return (
    <Router>
      <Routes>
        <Route path="/addaccountssh" element={<GenerateSSHToken />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/" element={config.sshFile.length > 0 ? <Dashboard /> : <Homepage />} />
      </Routes>
    </Router>
  )
}


