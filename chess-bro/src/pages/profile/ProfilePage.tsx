import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import PersonalInfo from './PersonalInfo';
import Preferences from './Preferences';
import History from './History';


export default function ProfilePage() {
    const params = useParams<{ profileId: string }>();

    const [tab, setTab] = useState<number>(0);


    return (
        <div className="flex flex-col gap-20">
            <div className="flex flex-row">
                <h1 className='self-center justify-center'>Dette er din profilside {params.profileId}</h1>
                <Button variant="outlined" color="error" sx={{margin: 1, justifySelf: 'flex-end'}}
                //onClick={setIsLogin()}
                >Logg ut</Button>
            </div>
            
            <div className='flex flex-row'>
                <Tabs
                    orientation="vertical"
                    value={tab}
                    onChange={(e, newTab) => setTab(newTab)}
                    sx={{
                        width: 1/5
                    }}
                >
                    <Tab label="Personal Info"/>
                    <Tab label="Preferences"/>
                    <Tab label="History"/>
                </Tabs>
                <Box>
                    {tab === 0 && <PersonalInfo />}
                    {tab === 1 && <Preferences />}
                    {tab === 2 && <History />}
                </Box>
            </div>
            
        </div>
    )
}