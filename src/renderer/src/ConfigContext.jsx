import { createContext, useEffect, useState } from "react";

// Create context
export const ConfigContext = createContext();
export const APP_SSH_PREFIX = "accswitch_";

// Create provider
export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState({ currentUser: {}, sshFile: [], repos: [] });
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
  try {
    const data = window.electronAPI.readDataFileSync('currentUser');
    console.log(data);
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to fetch active account:", error);
  }
}

function fetchRepos() {
  console.log("getting repos");
  try {
    const data = window.electronAPI.readDataFileSync('repos');
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to fetch repos:", error);
  }
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
"sshFile": [{}],
"repos": [
{userEmail: "", username: "", "repos": [{name: "", url: "", status: "finished | loading"}]}
]
}
*/