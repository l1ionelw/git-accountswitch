import { useState } from "react";
import ReposList from "./ReposList";

export default function Separator() {
    const [selectedRepo, setSelectedRepo] = useState({}) // repo by item (json)
    return (
        <div style={styles.container}>
            <div style={styles.leftPanel}>
                <ReposList />
            </div>
            <div style={styles.rightPanel}>
                Right panel
            </div>
        </div>
    );
};
const styles = {
    container: {
        display: 'flex',
        flex: 1
    },
    leftPanel: {
        width: '33.333%',
        backgroundColor: '#f8f8f8',
        display: 'flex',
        justifyContent: 'center',
        borderRight: '1px solid #e2e2e2'
    },
    rightPanel: {
        width: '66.667%',
        padding: '16px',
        backgroundColor: '#ffffff',
        display: 'flex',
    },
    panelText: {
        fontWeight: '500',
        color: '#444'
    }
};
