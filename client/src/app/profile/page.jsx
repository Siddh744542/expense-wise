"use client";
import axios from "axios";
import React from "react";
import Header from "../(components)/Header";

function Profile() {
  const handleClick = async (e) => {
    await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/users/me`);
  };

  return (
    <div>
      <Header />
      <button className="bg-blue-500 text-white" onClick={handleClick}>
        get user
      </button>
    </div>
  );
}

export default Profile;
