import { useEffect, useState } from "react";
import NoAccountsAvaliable from "./components/NoAccountsAvaliable";

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
    <div>
      {config.length === 0 && <NoAccountsAvaliable />}
    </div>
  )
}
function getAppOwnedConfigs(config) {
  var myConfigs = [];
  for (let x of config) {
    if (x.value.startsWith("accswitch_")) {
      myConfigs.push(x)
    }
  }
  return myConfigs
}

