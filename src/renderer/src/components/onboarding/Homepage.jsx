import { useState } from "react";
import Selector from "./Selector";

export default function Homepage() {
    console.log("no accounts found");
    const [addOption, setAddOption] = useState("none"); // none, new-account, import-account
    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>You have no accounts added</h2>
            {addOption === "none" && <button style={styles.button} onClick={() => setAddOption("new-account")}>Add Account</button>}
            {addOption !== "none" && <div>
                <h1>Add an account</h1>
                <Selector />
            </div>}
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        textAlign: 'center'
    },
    heading: {
        color: '#343a40'
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
    }
};