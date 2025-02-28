import { Button, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";

export default function PersonalInfo() {

    const [gender, setGender] = useState("");
    const [country, setCountry] = useState("");
    const [countries, setCountries] = useState<string[]>([]);

    const [editMode, setEditMode] = useState(false);


    useEffect(() => {
    const fetchCountries = async () => {
        try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryNames = data.map((country: any) => country.name.common).sort();
        setCountries(countryNames);
        } catch (error) {
        console.error("Error fetching countries:", error);
        }
    };

    fetchCountries();
    }, []);



    return (
        <div className="flex flex-col">
            <div className="grid grid-cols-4 gap-4">

                <label className="flex justify-center items-center">Username:</label>
                <TextField disabled={!editMode}/>

                <label className="flex justify-center items-center">Email:</label>
                <TextField disabled={!editMode}/>

                <label className="flex justify-center items-center">Phone number:</label>
                <TextField disabled={!editMode}/>

                <label className="flex justify-center items-center">Gender:</label>
                <Select 
                    value={gender}
                    disabled={!editMode}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </Select>

                <label className="flex justify-center items-center">Country:</label>
                <Select 
                    value={country}
                    disabled={!editMode}
                    onChange={(e) => setCountry(e.target.value)}
                >
                    {countries.map((countryName, index) => (
                    <MenuItem key={index} value={countryName}>
                        {countryName}
                    </MenuItem>
                    ))}
                </Select>

                <label className="flex justify-center items-center">City:</label>
                <TextField disabled={!editMode}/>

                <label className="flex justify-center items-center">Adress:</label>
                <TextField disabled={!editMode}/>

                <label className="flex justify-center items-center">Zip code:</label>
                <TextField disabled={!editMode}/>
            </div>
            <Button variant="outlined" sx={{margin: 2, alignSelf: 'flex-end'}}
                onClick={() => setEditMode((mode) => !mode)}
            >
                {editMode ? "Save" : "Edit"}
            </Button>
        </div>
    )
}