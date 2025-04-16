export default function Separator() {
    const styles = {
        container: {
            display: 'flex',
            flex: 1
        },
        leftPanel: {
            width: '33.333%',
            padding: '16px',
            backgroundColor: '#f8f8f8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRight: '1px solid #e2e2e2'
        },
        rightPanel: {
            width: '66.667%',
            padding: '16px',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        panelText: {
            fontWeight: '500',
            color: '#444'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.leftPanel}>
                <p style={styles.panelText}>Left Panel (1/3)</p>
            </div>
            <div style={styles.rightPanel}>
                <p style={styles.panelText}>Right Panel (2/3)</p>
            </div>
        </div>
    );
};