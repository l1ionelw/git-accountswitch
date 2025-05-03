import { useContext, useEffect, useState } from "react";
import ReposList from "./ReposList";
import { ConfigContext } from "../../ConfigContext";

export default function Separator() {
    const [selectedRepo, setSelectedRepo] = useState("") // repo by name, then itll use context
    const { config, setConfig } = useContext(ConfigContext);
    const [repoCommitDetails, setRepoCommitDetails] = useState("");
    const repoSelection = config.repos.find(repo =>
        repo.userEmail === config.currentUser.email &&
        repo.username === config.currentUser.username
    )?.repos || [];
    console.log("repos belonging to this user: ")
    console.log(repoSelection);
    const repo = repoSelection.find(item => item.name === selectedRepo) || {};
    console.log(repo);

    console.log(repo);
    useEffect(() => {
        console.log(repo.path)
        window.electronAPI.getRepoCommitDetails(repo.path).then(response => {
            setRepoCommitDetails(response);
        })
    }, [selectedRepo]);
    return (
        <div style={styles.container}>
            <div style={styles.leftPanel}>
                <ReposList setSelectedRepo={setSelectedRepo} />
            </div>
            <div style={styles.rightPanel}>
                {selectedRepo !== "" && <div>
                    <h1>{repo.name}</h1>
                    <h3><em>{repo.path}</em></h3>
                    <em>Authentication using: {config.currentUser.email}</em>
                    <div>
                        <em>Commit details:</em>
                        <br />
                        <em>{repoCommitDetails.email}</em>
                        <br />
                        <em>{repoCommitDetails.name}</em>
                    </div>
                </div>}
            </div>
        </div>
    );
};
const styles = {
    container: {
        display: 'flex',
        flex: 1,
        height: "100vh"
    },
    leftPanel: {
        width: '33.333%',
        backgroundColor: '#f8f8f8',
        display: 'flex',
        justifyContent: 'center',
        borderRight: '1px solid #e2e2e2',
        height: "100vh",
        overflow: "scroll"
    },
    rightPanel: {
        width: '66.667%',
        padding: '16px',
        backgroundColor: '#ffffff',
        display: 'flex',
        height: "100vh"
    },
    panelText: {
        fontWeight: '500',
        color: '#444'
    }
};
