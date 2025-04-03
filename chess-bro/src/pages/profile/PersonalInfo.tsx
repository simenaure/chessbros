import { Button, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { user } from "../../login/user";

export default function PersonalInfo(userID: user) {
  const [username] = useState(userID.username);
  const [email] = useState(userID.email);
  const [firstname] = useState(userID.firstname);
  const [lastname] = useState(userID.lastname);
  const [gender, setGender] = useState(userID.gender);
  const [country, setCountry] = useState(userID.country);
  const [address, setAddress] = useState(userID.address);
  const [phone, setPhone] = useState(userID.phone);
  const [city, setCity] = useState(userID.city);

  const [editMode, setEditMode] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);

  /*useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/profile?username=${profileId}`
        );
        const data = await response.json();
        if (response.ok) {
          setUsername(data.username || "");
          setEmail(data.email || "");
          setGender(data.gender || "");
        } else {
          console.error("Error fetching profile:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    
  }, [profileId]); */

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryNames = data.map((c: any) => c.name.common).sort();
        setCountries(countryNames);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleEditToggle = () => {
    if (editMode) {
      console.log("Saving profile...");
      console.log(userID);
    }
    setEditMode(!editMode);
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-4 gap-4">
        <label className="flex justify-center items-center">Username:</label>
        <TextField value={username} disabled={!editMode} />
        <label className="flex justify-center items-center">Email:</label>
        <TextField value={email} disabled={!editMode} />
        <label className="flex justify-center items-center">Firstname:</label>
        <TextField value={firstname} disabled={!editMode} />
        <label className="flex justify-center items-center">Lastname:</label>
        <TextField value={lastname} disabled={!editMode} />
        <label className="flex justify-center items-center">
          Phone number:
        </label>
        <TextField
          value={phone}
          disabled={!editMode}
          onChange={(e) => setPhone(e.target.value)}
        />
        <label className="flex justify-center items-center">Gender:</label>
        <Select
          value={gender}
          disabled={!editMode}
          onChange={(e) => setGender(e.target.value as string)}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
        <label className="flex justify-center items-center">Country:</label>
        <Select
          value={country}
          disabled={!editMode}
          onChange={(e) => setCountry(e.target.value as string)}
        >
          {countries.map((countryName, index) => (
            <MenuItem key={index} value={countryName}>
              {countryName}
            </MenuItem>
          ))}
        </Select>
        <label className="flex justify-center items-center">City:</label>
        <TextField
          value={city}
          disabled={!editMode}
          onChange={(e) => setCity(e.target.value)}
        />
        <label className="flex justify-center items-center">Address:</label>
        <TextField
          value={address}
          disabled={!editMode}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <Button
        variant="outlined"
        sx={{ margin: 2, alignSelf: "flex-end" }}
        onClick={handleEditToggle}
      >
        {editMode ? "Save" : "Edit"}
      </Button>
    </div>
  );
}
