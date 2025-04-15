import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Homepage from "./components/onboarding/Homepage";
import GenerateSSHToken from "./components/generate_ssh_token/GenerateSSHToken";
export const APP_SSH_PREFIX = "accswitch_";
export default function App() {
  const [config, setConfig] = useState([]);
  useEffect(() => {
    window.electronAPI.readSSHConfig().then(result => {
      let configResult = getAppOwnedConfigs(result)
      setConfig(configResult);
      console.log("configs registered to this app: ")
      console.log(configResult);
    })
  }, [])


  return (
    <Router>
      <Routes>
        <Route path="/addaccountssh" element={<GenerateSSHToken />} />
        <Route path="/" element={<Homepage />} />
      </Routes>
    </Router>
  )
}
function getAppOwnedConfigs(config) {
  var myConfigs = [];
  for (let x of config) {
    if (x.value.startsWith(APP_SSH_PREFIX)) {
      myConfigs.push(x)
    }
  }
  return myConfigs
}

