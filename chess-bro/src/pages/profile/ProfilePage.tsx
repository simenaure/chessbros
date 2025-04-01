import React from "react";
import { useParams } from "react-router-dom";
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
  const { profileId } = useParams();

  // Check if logged in and profileId matches the user
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p>You must be logged in to view this profile.</p>
      </div>
    );
  }

  if (user.username !== profileId) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p>Access denied: You are not authorized to view this profile.</p>
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
            // You can improve this with a real logout method
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
