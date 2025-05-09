import { useContext } from "react";
import Separator from "./Separator";
import TopSection from "./TopSection";
import { ConfigContext } from "../../ConfigContext";

export default function Dashboard() {
    const { config, setConfig } = useContext(ConfigContext);

    return (
        <div style={styles.container}>
            <TopSection />
            <Separator />
        </div>
    );
}
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        border: '1px solid #e2e2e2',
        borderRadius: '8px',
        overflow: 'hidden'
    }
};