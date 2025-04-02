import { Button } from "@mui/material";
import PersonalInfo from "./PersonalInfo";
import { user } from "../../login/user";

export default function ProfilePage(userID: user) {
  if (!userID) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your profile: {userID.username}</h1>
        <Button
          variant="outlined"
          color="error"
          onClick={() => {
            // For now, logout by reloading the page
            window.location.reload();
          }}
        >
          Log Out
        </Button>
      </div>
      <PersonalInfo {...userID} />
    </div>
  );
}
