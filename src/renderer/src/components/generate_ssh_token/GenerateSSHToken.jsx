import { useEffect, useState } from "react";
import { APP_SSH_PREFIX } from "../../ConfigContext";

export default function GenerateSSHToken() {
    const [friendlyName, setFriendlyName] = useState("");
    const [accountEmail, setAccountEmail] = useState("");
    const [commandsResult, setCommandsResult] = useState([]);
    const [buttonEnabled, setButtonEnabled] = useState(true);
    const [accountUsername, setAccountUsername] = useState("")
    function updateProfileName(newProfileName) {
        setFriendlyName(newProfileName.replace(" ", "_").replace("-", "_"));
    }

    function createSSHEntry() {
        setButtonEnabled(false);
        const sshEntryName = APP_SSH_PREFIX + friendlyName.trim();
        const sshEntryEmail = accountEmail.trim();
        const sshAccountUsername = accountUsername.trim();
        console.log(sshAccountUsername);

        window.electronAPI.createNewSSHToken(sshEntryName, sshEntryEmail, sshAccountUsername)
            .then(response => {
                console.log(response);
                setCommandsResult(response);
            })
            .catch(error => {
                console.error("Error creating SSH token:", error);
            });
    }
    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Add account with SSH</h1>
            <form style={styles.form} onSubmit={(e) => { e.preventDefault(); createSSHEntry(); }}>
                <div style={styles.inputGroup}>
                    <label style={styles.label} htmlFor="profileName">Profile Name (Friendly name):</label>
                    <input
                        style={styles.input}
                        placeholder="work_account"
                        type="text"
                        id="profileName"
                        value={friendlyName}
                        onChange={(e) => updateProfileName(e.target.value)}
                        required
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label} htmlFor="accountEmail">Account Email:</label>
                    <input
                        style={styles.input}
                        type="email"
                        id="accountEmail"
                        placeholder="supercoolworkemail@company.com"
                        value={accountEmail}
                        onChange={(e) => setAccountEmail(e.target.value)}
                        required
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label} htmlFor="accountUsername">Github account username:</label>
                    <input
                        style={styles.input}
                        type="text"
                        id="accountUsername"
                        placeholder="supercooldev"
                        value={accountUsername}
                        onChange={(e) => setAccountUsername(e.target.value)}
                        required
                    />
                </div>
                <button style={buttonEnabled ? styles.button : styles.buttonDisabled} type="submit" disabled={!buttonEnabled}>Create SSH Token</button>
            </form>
            {commandsResult.length > 0 && (
                <div style={styles.successMessage}>
                    <h2>Your SSH token has been generated, please go to the <a href="https://github.com/settings/keys" target="_blank" rel="noopener noreferrer">GitHub developer settings</a> to add this SSH key</h2>
                    <h3>Command Output:</h3>
                    <pre style={styles.codeBox}>{commandsResult[commandsResult.length - 1].output}</pre>
                    <button style={styles.button} onClick={() => window.location.href = '/'}>Next</button>
                </div>

            )}
            {commandsResult.length > 0 && <div>
                <h1>PROGRESS</h1>
                {commandsResult.map((result, index) => (
                    <div key={index} style={styles.resultContainer}>
                        <h2 style={styles.resultHeading}>{result.status}</h2>
                        <pre style={styles.codeBox}>{result.command}</pre>
                        <h3 style={styles.outputHeading}>Output</h3>
                        <pre style={styles.codeBox}>{result.output}</pre>
                        <hr style={{ margin: '20px 0' }} /> {/* Added line at the end */}
                    </div>
                ))}
            </div>}
        </div>
    )
}

const styles = {
    buttonDisabled: {
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        color: '#6c757d', // Grey color for disabled state
        backgroundColor: '#e9ecef', // Light grey background for disabled state
        border: '1px solid #ced4da',
        borderRadius: '5px',
        cursor: 'not-allowed',
        opacity: 0.65, // Slightly transparent to indicate disabled state
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        color: '#343a40',
        marginBottom: '20px',
    },
    codeBox: {
        backgroundColor: '#282c34',
        color: '#61dafb',
        padding: '10px',
        borderRadius: '5px',
        fontFamily: 'monospace',
        fontSize: '16px',
        overflowX: 'auto',
    },
    code: {
        whiteSpace: 'pre-wrap',
    },
    button: {
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        color: '#495057',
    },
    inputGroup: {
        marginBottom: '15px',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ced4da',
        borderRadius: '7px',
        width: '40%',
        boxSizing: 'border-box',
    },
    errorMessage: {
        color: '#dc3545', // Bootstrap danger color
        fontSize: '14px',
        marginTop: '5px',
    }
};