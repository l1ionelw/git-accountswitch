import { useContext, useState } from "react";
import { ConfigContext } from "../../ConfigContext";
export default function Settings() {
    const { config, setConfig } = useContext(ConfigContext);
    const [folder, setFolder] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    function openFilePicker() {
        window.electronAPI.selectFolder().then(result => {
            console.log(result);
            setErrorMessage("");
            if (result.includes(" ")) {
                console.log("Has spaces, am not saving")
                setErrorMessage("Your chosen folder has spaces, please choose one that doesn't have any spaces")
            } else {
                setErrorMessage("Successfully set folder to " + result);
                const newConfig = { ...config, settings: { reposLocation: result } };
                setConfig(newConfig);
                window.electronAPI.writeDataFileSync("settings", JSON.stringify(newConfig.settings))
            }
        })
    }

    return (
        <div style={styles.container}>
            <button style={styles.backButton} onClick={() => window.history.back()}>Back</button>
            <h1 style={styles.title}>Settings</h1>
            <strong>Current folder: {config.settings ? config.settings.reposLocation : "Your documents directory"}</strong>
            <button onClick={openFilePicker}>Choose new repo folder</button>
            <button style={styles.submitButton} onClick={openFilePicker}>Submit</button>
            <div style={{ color: 'red' }}>{errorMessage}</div>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: '#f8f9fa',
        height: '100vh',
    },
    backButton: {
        marginBottom: '20px',
        padding: '10px 15px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    title: {
        marginBottom: '20px',
        fontSize: '24px',
        color: '#333',
    },
    folderPicker: {
        marginBottom: '20px',
    },
    submitButton: {
        padding: '10px 15px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#28a745',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};
