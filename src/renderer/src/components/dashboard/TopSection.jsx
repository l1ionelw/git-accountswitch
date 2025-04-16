import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../../ConfigContext";

export default function TopSection() {
    const { config, setConfig } = useContext(ConfigContext);
    const currentUser = config.currentUser;
    const [hasUserAccount, setHasUserAccount] = useState(true);
    const [showAccountSelector, setShowAccountSelector] = useState(false);


    useEffect(() => {
        setHasUserAccount(!!(currentUser.email && currentUser.username && currentUser.sshProfile));
    }, [currentUser]);
    return (
        <div style={styles.container}>
            <div style={styles.accountSwitcher} onClick={() => setShowAccountSelector(!showAccountSelector)}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={styles.userAvatar}>{hasUserAccount && currentUser.username ? currentUser.username.charAt(0).toUpperCase() : ""}</div>
                        <div style={styles.userInfo}>
                            <p style={styles.username}>{hasUserAccount && currentUser.username ? currentUser.username : "Select account"}</p>
                            <p style={styles.email}>{hasUserAccount && currentUser.email ? currentUser.email : ""}</p>
                        </div>
                    </div>
                    <div style={styles.dropdownArrow}>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </div>
                </div>
            </div>
            <div style={styles.rightPanel}>
                <p style={styles.panelText}>Dashboard</p>
            </div>
            {showAccountSelector && (
                <div style={styles.accountSelectorPopup}>
                    {/* Account selection logic goes here */}
                    <p>Select an account:</p>
                    <ul style={styles.sshFileList}>
                        {config.sshFile.map((sshConfig, index) => (
                            <li key={index} style={styles.sshFileItem}>
                                {sshConfig.value}
                                <button onClick={() => handleSelectAccount(sshConfig.value)} style={{ marginLeft: '10px' }}>
                                    Select
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const styles = {
    sshFileList: {
        listStyleType: 'none',
        padding: '0',
        margin: '0',
        maxHeight: '200px',
        overflowY: 'auto',
        border: '1px solid #e2e2e2',
        borderRadius: '4px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    sshFileItem: {
        padding: '8px 12px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    sshFileItemHover: {
        backgroundColor: '#f0f0f0',
    },
    accountSelectorPopup: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        border: '1px solid #e2e2e2',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        zIndex: 1000
    },
    container: {
        display: 'flex',
        height: '80px',
        borderBottom: '1px solid #e2e2e2',
        backgroundColor: '#fafafa'
    },
    accountSwitcher: {
        width: '33.333%',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        borderRight: '1px solid #e2e2e2',
        cursor: 'pointer',
        overflow: "hidden"
    },
    userAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '12px',
        fontSize: '16px',
        fontWeight: '500',
        color: '#666'
    },
    userInfo: {
        flex: 1
    },
    username: {
        margin: '0 0 4px 0',
        fontWeight: '500',
        fontSize: '16px',
        color: '#333'
    },
    email: {
        margin: '0',
        fontStyle: 'italic',
        fontSize: '14px',
        color: '#666'
    },
    dropdownArrow: {
        marginLeft: '8px'
    },
    rightPanel: {
        width: '66.667%',
        padding: '16px',
        display: 'flex',
        alignItems: 'center'
    },
    panelText: {
        fontWeight: '500',
        color: '#444'
    }
};
