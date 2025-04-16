import { createContext, useEffect, useState } from "react";

// Create context
export const ConfigContext = createContext();
export const APP_SSH_PREFIX = "accswitch_";

// Create provider
export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({ currentUser: {}, sshFile: [] });
  useEffect(() => {
    fetchConfig().then(configResult => {
      setConfig(prevConfig => ({ ...prevConfig, sshFile: configResult }));
    });
    setConfig(prevConfig => ({ ...prevConfig, currentUser: fetchActiveAccount() }));
  }, []);

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );

};
async function fetchConfig() {
  try {
    const response = await window.electronAPI.readSSHConfig();
    const configResult = getAppOwnedConfigs(response);
    console.log("configs registered to this app: ", configResult);
    return configResult;
  } catch (error) {
    console.error("Failed to fetch config:", error);
  }
}
function fetchActiveAccount() {
  let json = { sshProfile: localStorage.getItem("sshProfile"), username: localStorage.getItem("username"), email: localStorage.getItem("email") }
  return json;
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

/*
{
"currentUser": {sshProfile: "", username: "", email: ""}
"sshFile": [],
}
*/