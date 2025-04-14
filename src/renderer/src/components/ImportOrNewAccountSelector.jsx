import { useState } from "react";

export default function ImportOrNewAccountSelector() {
    const [activeView, setActiveView] = useState("left");
    const [showLoginWhyMessage, setShowLoginWhyMessage] = useState(false);
    function createSSHToken() {
        console.log("Create SSH Token clicked");
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                {/* Selector tabs */}
                <div style={styles.tabContainer}>
                    <button
                        style={{
                            ...styles.tab,
                            ...(activeView === "left" ? styles.activeTab : styles.inactiveTab),
                        }}
                        onClick={() => setActiveView("left")}
                        onMouseOver={(e) => {
                            if (activeView !== "left") {
                                e.target.style.backgroundColor = "#f3f4f6";
                            }
                        }}
                        onMouseOut={(e) => {
                            if (activeView !== "left") {
                                e.target.style.backgroundColor = "white";
                            }
                        }}>
                        Login
                    </button>
                    <button
                        style={{
                            ...styles.tab,
                            ...(activeView === "right" ? styles.activeTab : styles.inactiveTab),
                        }}
                        onClick={() => setActiveView("right")}
                        onMouseOver={(e) => {
                            if (activeView !== "right") {
                                e.target.style.backgroundColor = "#f3f4f6";
                            }
                        }}
                        onMouseOut={(e) => {
                            if (activeView !== "right") {
                                e.target.style.backgroundColor = "white";
                            }
                        }}>
                        Import SSH Config
                    </button>
                </div>

                {/* Content area */}
                <div style={styles.contentArea}>
                    {activeView === "left" ? (
                        <div>
                            <h3 style={styles.viewTitle}>Login</h3>
                            <p style={styles.paragraph}>Create a new SSH key which allows access into your account</p>
                            <em>why not login with browser? <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => setShowLoginWhyMessage(!showLoginWhyMessage)}>why</span></em>
                            <br />
                            {showLoginWhyMessage === true && <em>The easiest way to customize push identities and authentication for each repository individually is through the command line which uses primarily SSH.<br /></em>}
                            <button style={styles.button} onClick={createSSHToken}>Create SSH Token</button>
                        </div>

                    ) : (
                        <div>
                            <h3 style={styles.viewTitle}>Import SSH Config</h3>
                            <p style={styles.paragraph}>If you already have accounts saved in SSH config, you can import them here </p>
                            <button style={styles.button} onClick={createSSHToken}>Import SSH Profile</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
    },
    card: {
        width: "100%",
        maxWidth: "500px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "24px",
    },
    title: {
        fontSize: "20px",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "24px",
    },
    tabContainer: {
        display: "flex",
        border: "1px solid #e5e7eb",
        borderRadius: "6px",
        overflow: "hidden",
        marginBottom: "24px",
    },
    tab: {
        flex: 1,
        padding: "12px 16px",
        fontWeight: "500",
        border: "none",
        cursor: "pointer",
        transition: "all 0.2s ease",
    },
    activeTab: {
        backgroundColor: "#3b82f6",
        color: "white",
    },
    inactiveTab: {
        backgroundColor: "white",
        color: "#374151",
    },
    contentArea: {
        padding: "16px",
        backgroundColor: "#f9fafb",
        borderRadius: "6px",
        minHeight: "200px",
    },
    viewTitle: {
        fontWeight: "bold",
        fontSize: "18px",
        marginBottom: "12px",
    },
    paragraph: {
        marginBottom: "12px",
    },
    button: {
        padding: "10px 20px",
        marginTop: "1rem",
        fontSize: "16px",
        color: "white",
        backgroundColor: "#007bff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s ease, transform 0.2s ease",
    },

};
