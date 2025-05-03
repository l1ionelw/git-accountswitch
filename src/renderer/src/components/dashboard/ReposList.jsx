import { useContext, useState } from "react";
import { ConfigContext } from "../../ConfigContext";
import { produce } from "immer";
import pathJoin from "../../pathJoin"

export default function ReposList({ setSelectedRepo }) {
    const { config, setConfig } = useContext(ConfigContext);
    const repos = config.repos.find(repo =>
        repo.userEmail === config.currentUser.email &&
        repo.username === config.currentUser.username
    )?.repos || [];
    const [repoUrl, setRepoUrl] = useState("");
    const [addRepoClicked, setAddRepoClicked] = useState(false);
    function handleAddClick() {
        setAddRepoClicked(!addRepoClicked);
    };
    function handleFetchNewRepo() {
        if (!repoUrl.trim().startsWith("http")) {
            console.error("Can't pull repo unless repo url is http/https!")
            return;
        }
        const gitUsername = config.currentUser.username;
        const sshProfileName = config.currentUser.sshProfile;
        let githubRepoName = repoUrl.trim().split("/");
        githubRepoName = githubRepoName[githubRepoName.length - 1].replace(".git", "");
        const url = `git@${sshProfileName}:${gitUsername}/${githubRepoName}`
        console.log(url);
        window.electronAPI.cloneGitRepo(url, githubRepoName, config.settings.reposLocation).then(async (result) => {
            console.log("finished git clone, adding state");
            console.log(result);
            let updatedConfig = produce(config, draft => {
                const repo = draft.repos.find(repo =>
                    repo.userEmail === config.currentUser.email && repo.username === gitUsername
                );
                console.log("found repo to append to: ");
                console.log(repo);
                console.log("new repo path");
                console.log(pathJoin([config.settings.reposLocation, githubRepoName]));
                if (repo) {
                    repo.repos.push({ name: githubRepoName, url: url, status: "loading", path: pathJoin([config.settings.reposLocation, githubRepoName]) });
                } else {
                    config.repos.push({ userEmail: config.currentUser.email, username: gitUsername, repos: [{ name: githubRepoName, url: url, status: "loading", path: pathJoin([config.settings.reposLocation, githubRepoName]) }] })
                }
            });

            await window.electronAPI.setRepoMainUser(url, gitUsername, config.currentUser.email, githubRepoName, config.settings.reposLocation).then((result) => {
                console.log("finished setting commit roles for server");
                console.log(result)
                updatedConfig = produce(updatedConfig, draft => {
                    const repo = draft.repos.find(repo =>
                        repo.userEmail === config.currentUser.email &&
                        repo.username === gitUsername
                    );
                    repo?.repos.forEach(r => {
                        if (r.name === githubRepoName) r.status = "finished";
                    });
                });
                setConfig(updatedConfig);
                window.electronAPI.writeDataFileSync('repositories', JSON.stringify(updatedConfig.repos)).then((result) => {
                    console.log("Repositories saved successfully:", result);
                }).catch((error) => {
                    console.error("Failed to save repositories:", error);
                });
            })
        })
    }

    function handleMouseEnter(e) {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    };

    function handleMouseLeave(e) {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
    };
    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Repositories</h2>
            <br />
            <button
                style={styles.addButton}
                onClick={handleAddClick}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
            ><span style={styles.plusIcon}>+</span>Add Repository</button>

            {addRepoClicked && <div>
                <p>Add a repository</p>
                <label>Repo URL</label>
                <br />
                <input style={{ ...styles.input, width: '99%' }} onChange={(e) => setRepoUrl(e.target.value)} />
                <button onClick={handleFetchNewRepo} style={styles.addButton}>Clone</button>
            </div>}


            {(repos && repos.length > 0) ? (
                <div style={styles.repoList}>
                    {repos.map((item, index) => (
                        <div
                            key={index}
                            style={styles.repoCard}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            onClick={() => { setSelectedRepo(item.name) }}
                        >
                            <span style={styles.repoName}>{item.name}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={styles.emptyState}>
                    <div style={styles.repoIcon}>📁</div>
                    <p style={styles.emptyText}>No repositories found. Click the Add Repository button to get started.</p>
                </div>
            )}
        </div>
    );
}

const styles = {
    repoCard: {
        padding: '16px 20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        overflow: 'hidden',  // Add this to clip overflow
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        border: '1px solid #ced4da',
        borderRadius: '7px',
        width: '40%',
        boxSizing: 'border-box',
    },

    container: {
        // Remove the maxWidth or change it to '100%'
        padding: '24px',
        background: '#f9fafb',
        borderRadius: '12px',
        minHeight: '400px',
        width: '100%',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        margin: '0 auto',
        boxSizing: 'border-box',  // Add this to include padding in width
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
    },
    title: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#1f2937',
        margin: 0,
    },
    addButton: {
        marginTop: "1rem",
        marginBottom: "1rem",
        padding: '8px 16px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    plusIcon: {
        fontSize: '16px',
    },
    repoList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    repoItem: {
        padding: '16px 20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        overflow: 'hidden',  // Add this to clip overflow
    },
    repoName: {
        fontSize: '16px',
        fontWeight: '500',
        color: '#374151',
        overflow: 'hidden',  // Add this to hide overflow
        textOverflow: 'ellipsis',  // Add this to show ellipsis for long text
        whiteSpace: 'nowrap',  // Add this to prevent text wrapping to next line
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        color: '#6b7280',
        textAlign: 'center',
        width: '100%',
    },
    emptyText: {
        fontSize: '14px',
        marginTop: '8px',
    },
    repoIcon: {
        fontSize: '32px',
        color: '#9ca3af',
        marginBottom: '8px',
    }
};