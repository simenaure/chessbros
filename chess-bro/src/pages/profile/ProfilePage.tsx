import React from "react";
import { Button } from "@mui/material";
import PersonalInfo from "./PersonalInfo";

interface ProfilePageProps {
  user?: {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    gender: string;
  };
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your profile, {user.username}</h1>
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
      <PersonalInfo profileId={user.username} />
    </div>
  );
};

export default ProfilePage;
