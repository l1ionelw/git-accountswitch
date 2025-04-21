import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "../../ConfigContext";

export default function TopSection() {
    const { config, setConfig } = useContext(ConfigContext);
    const currentUser = config.currentUser;
    const [hasUserAccount, setHasUserAccount] = useState(true);
    const [showAccountSelector, setShowAccountSelector] = useState(false);
    const [hoveredAccount, setHoveredAccount] = useState(null);

    useEffect(() => {
        setHasUserAccount(!!(currentUser.email && currentUser.username && currentUser.sshProfile));
    }, [currentUser]);

    const handleSelectAccount = (sshProfile) => {
        // Update the current user with the selected SSH profile
        const emailEntry = sshProfile.config.find(item => item.content && item.content.startsWith("# Email"));
        const usernameEntry = sshProfile.config.find(item => item.content && item.content.startsWith("# GithubUsername"))
        const currentUserEntry = {
            sshProfile: sshProfile.value,
            email: emailEntry.content.replace("# Email", "").trim(),
            username: usernameEntry.content.replace("# GithubUsername", "").trim(),
        }
        setConfig({
            ...config,
            currentUser: currentUserEntry
        });
        window.electronAPI.writeDataFileSync("currentUser", JSON.stringify(currentUserEntry));
        setShowAccountSelector(false);
    };

    return (
        <div style={styles.container}>
            <div style={styles.accountSwitcher} onClick={() => setShowAccountSelector(!showAccountSelector)}>
                <div style={styles.accountSwitcherInner}>
                    <div style={styles.userInfoContainer}>
                        <div style={styles.userAvatar}>
                            {hasUserAccount && currentUser.username ? currentUser.username.charAt(0).toUpperCase() : "?"}
                        </div>
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
                            style={showAccountSelector ? styles.arrowUp : {}}
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
                <div id="accountSelectorContainer" style={styles.accountSelectorPopup}>
                    <div style={styles.popupHeader}>
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={styles.accountsIcon}
                        >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                        <span style={styles.popupHeaderText}>Switch Account</span>
                    </div>

                    <div style={styles.accountsList}>
                        {config.sshFile.map((sshConfig, index) => (
                            <div
                                key={index}
                                style={{
                                    ...styles.accountItem,
                                    ...(hoveredAccount === index ? styles.accountItemHover : {}),
                                    ...(currentUser.sshProfile === sshConfig.value ? styles.accountItemSelected : {})
                                }}
                                onClick={() => handleSelectAccount(config.sshFile[index])}
                                onMouseEnter={() => setHoveredAccount(index)}
                                onMouseLeave={() => setHoveredAccount(null)}
                            >
                                <div style={styles.accountItemAvatar}>
                                    {sshConfig.value.charAt(0).toUpperCase()}
                                </div>
                                <div style={styles.accountItemDetails}>
                                    <span style={currentUser.sshProfile === sshConfig.value ? styles.accountItemNameSelected : styles.accountItemName}>
                                        {sshConfig.value}
                                    </span>
                                </div>
                                {currentUser.sshProfile === sshConfig.value && (
                                    <div style={styles.activeIndicator}>
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
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        height: '80px',
        borderBottom: '1px solid #e2e2e2',
        backgroundColor: '#fafafa',
        position: 'relative'
    },
    accountSwitcher: {
        width: '33.333%',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        borderRight: '1px solid #e2e2e2',
        cursor: 'pointer',
        overflow: "hidden",
        transition: 'background-color 0.2s ease',
        ':hover': {
            backgroundColor: '#f0f0f0'
        }
    },
    accountSwitcherInner: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    userInfoContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    userAvatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#3b82f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '12px',
        fontSize: '16px',
        fontWeight: '500',
        color: '#fff',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
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
        marginLeft: '8px',
        color: '#666',
        transition: 'transform 0.2s ease'
    },
    arrowUp: {
        transform: 'rotate(180deg)'
    },
    rightPanel: {
        width: '66.667%',
        padding: '16px',
        display: 'flex',
        alignItems: 'center'
    },
    panelText: {
        fontWeight: '500',
        color: '#444',
        fontSize: '18px'
    },
    accountSelectorPopup: {
        position: 'absolute',
        top: '85px',
        left: '16px',
        backgroundColor: '#fff',
        border: '1px solid #e2e2e2',
        borderRadius: '8px',
        width: '320px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out'
    },
    popupHeader: {
        padding: '12px 16px',
        borderBottom: '1px solid #e2e2e2',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f8f9fa'
    },
    accountsIcon: {
        color: '#3b82f6',
        marginRight: '8px'
    },
    popupHeaderText: {
        fontSize: '15px',
        fontWeight: '500',
        color: '#333'
    },
    accountsList: {
        maxHeight: '320px',
        overflowY: 'auto'
    },
    accountItem: {
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease'
    },
    accountItemHover: {
        backgroundColor: '#f0f7ff'
    },
    accountItemSelected: {
        backgroundColor: '#e6f2ff'
    },
    accountItemAvatar: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#4b5563',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '12px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#fff'
    },
    accountItemDetails: {
        flex: 1
    },
    accountItemName: {
        fontSize: '14px',
        color: '#333'
    },
    accountItemNameSelected: {
        fontSize: '14px',
        color: '#2563eb',
        fontWeight: '500'
    },
    activeIndicator: {
        color: '#2563eb',
        marginLeft: '8px'
    }
};