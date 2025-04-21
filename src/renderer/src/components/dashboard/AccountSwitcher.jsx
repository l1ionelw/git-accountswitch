import { useContext, useState } from "react";
import { ChevronDown, User, Users } from "lucide-react";
import { ConfigContext } from "../../ConfigContext";



export default function AccountSwitcher() {
    const { config, setConfig } = useContext(ConfigContext);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(config.currentUser ?? {});
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [isButtonFocused, setIsButtonFocused] = useState(false);
    const [hoveredAccountId, setHoveredAccountId] = useState(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelectAccount = (account) => {
        setSelectedAccount(account);
        setIsOpen(false);
        console.log(account);
        console.log(`Selected account: ${account.value}`);
    };

    return (
        <div style={styles.container}>
            <div style={styles.dropdownContainer}>
                {/* Main Button */}
                <button
                    onClick={toggleDropdown}
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                    onFocus={() => setIsButtonFocused(true)}
                    onBlur={() => setIsButtonFocused(false)}
                    style={{
                        ...styles.mainButton,
                        ...(isButtonHovered ? styles.mainButtonHover : {}),
                        ...(isButtonFocused ? styles.mainButtonFocus : {})
                    }}
                >
                    <div style={styles.buttonContent}>
                        <User size={20} color="#6b7280" />
                        <span style={styles.accountText}>{selectedAccount.value}</span>
                    </div>
                    <ChevronDown
                        size={18}
                        style={{
                            ...styles.chevron,
                            ...(isOpen ? styles.chevronOpen : {})
                        }}
                    />
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div style={styles.dropdown}>
                        <div style={styles.dropdownHeader}>
                            <Users size={16} color="#3b82f6" />
                            <span style={styles.dropdownHeaderText}>Accounts</span>
                        </div>
                        <div style={styles.accountsContainer}>
                            {config.sshFile.map((account) => (
                                <div
                                    key={account.id}
                                    onClick={() => handleSelectAccount(account)}
                                    onMouseEnter={() => setHoveredAccountId(account.id)}
                                    onMouseLeave={() => setHoveredAccountId(null)}
                                    style={{
                                        ...styles.accountItem,
                                        ...(hoveredAccountId === account.id ? styles.accountItemHover : {}),
                                        ...(selectedAccount.id === account.id ? styles.accountItemSelected : {})
                                    }}
                                >
                                    <User
                                        size={16}
                                        style={{
                                            ...styles.accountIcon,
                                            ...(selectedAccount.id === account.id ? styles.accountIconSelected : {})
                                        }}
                                    />
                                    <span
                                        style={{
                                            ...styles.accountName,
                                            ...(selectedAccount.id === account.id ? styles.accountNameSelected : {})
                                        }}
                                    >
                                        {account.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100vh",
        backgroundColor: "#f3f4f6"
    },
    dropdownContainer: {
        position: "relative",
        width: "256px"
    },
    mainButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "8px 16px",
        textAlign: "left",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        cursor: "pointer",
        outline: "none",
        border: "none",
        transition: "all 0.2s ease"
    },
    mainButtonHover: {
        backgroundColor: "#f9fafb"
    },
    mainButtonFocus: {
        boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)"
    },
    buttonContent: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },
    accountText: {
        fontWeight: "500",
        color: "#374151"
    },
    chevron: {
        color: "#6b7280",
        transition: "transform 0.2s"
    },
    chevronOpen: {
        transform: "rotate(180deg)"
    },
    dropdown: {
        position: "absolute",
        zIndex: "10",
        width: "100%",
        marginTop: "8px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
        border: "1px solid rgba(0,0,0,0.05)",
        overflow: "hidden"
    },
    dropdownHeader: {
        padding: "8px 12px",
        borderBottom: "1px solid #f3f4f6",
        display: "flex",
        alignItems: "center"
    },
    dropdownHeaderText: {
        fontSize: "14px",
        fontWeight: "500",
        color: "#374151",
        marginLeft: "8px"
    },
    accountsContainer: {
        maxHeight: "240px",
        overflowY: "auto"
    },
    accountItem: {
        display: "flex",
        alignItems: "center",
        padding: "8px 12px",
        cursor: "pointer",
        transition: "background-color 0.2s"
    },
    accountItemHover: {
        backgroundColor: "#f3f4f6"
    },
    accountItemSelected: {
        backgroundColor: "#f0f7ff"
    },
    accountIcon: {
        marginRight: "12px",
        color: "#9ca3af"
    },
    accountIconSelected: {
        color: "#3b82f6"
    },
    accountName: {
        fontSize: "14px",
        color: "#4b5563"
    },
    accountNameSelected: {
        color: "#3b82f6",
        fontWeight: "500"
    }
};