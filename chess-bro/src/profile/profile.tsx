import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';

const Profile = () => {

    const [variabel1, setVariabel1] = useState<number>(0);

    function handleChange(){
        setVariabel1(i => i + 1);
    }

    return (
        <div className="flex flex-row">
            <Tabs
                orientation="vertical"
                onChange={handleChange}
            >
                <Tab label="Item One" value="1"/>
                <Tab label="Item Two" value="2"/>
                <Tab label="Item Three" value="3"/>
            </Tabs>
            <h1>Dette er din profilside</h1>
            <form>
                <label>
                    Skriv {variabel1}
                </label>
                <input>
                </input>
            </form>
        </div>
    );
    

}

export default Profile