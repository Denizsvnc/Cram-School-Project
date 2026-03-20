import { useState } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import Ogrenciler from "../../Components/Ogrenciler";
import Ogretmenler from "../../Components/Ogretmenler";
import Mudurler from "../../Components/Mudurler";
import Veliler from "../../Components/Veliler";
import Personeller from "../../Components/Personeller";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

function Kullanicilar() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <PeopleAltIcon sx={{ fontSize: 32, color: "primary.main" }} />
                <Typography variant="h4" fontWeight={800}>
                    Kullanıcı Yönetimi
                </Typography>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        "& .MuiTab-root": {
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            minHeight: 48,
                        },
                    }}
                >
                    <Tab label="Öğrenciler" />
                    <Tab label="Öğretmenler" />
                    <Tab label="Müdürler" />
                    <Tab label="Veliler" />
                    <Tab label="Personeller" />
                </Tabs>
            </Box>

            <TabPanel value={activeTab} index={0}><Ogrenciler /></TabPanel>
            <TabPanel value={activeTab} index={1}><Ogretmenler /></TabPanel>
            <TabPanel value={activeTab} index={2}><Mudurler /></TabPanel>
            <TabPanel value={activeTab} index={3}><Veliler /></TabPanel>
            <TabPanel value={activeTab} index={4}><Personeller /></TabPanel>
        </Box>
    );
}

export default Kullanicilar;
