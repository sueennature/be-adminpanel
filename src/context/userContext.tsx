import React, { createContext, useState, ReactNode, useEffect } from "react";

interface UserContextType {
  user: string | null;
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
  groupOne: boolean;
  setGroupOne: React.Dispatch<React.SetStateAction<boolean>>;
  groupTwo: boolean;
  setGroupTwo: React.Dispatch<React.SetStateAction<boolean>>;
  groupThree: boolean;
  groupFour: boolean;
  setGroupFour: React.Dispatch<React.SetStateAction<boolean>>;
  groupFive: boolean;
  setGroupFive: React.Dispatch<React.SetStateAction<boolean>>;
  activeGroupNames: string[];
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>("");
  const [groupOne, setGroupOne] = useState<boolean>(true);
  const [groupTwo, setGroupTwo] = useState<boolean>(false);
  const [groupThree, setGroupThree] = useState<boolean>(false);
  const [groupFour, setGroupFour] = useState<boolean>(false);
  const [groupFive, setGroupFive] = useState<boolean>(false);
  const [activeGroupNames, setActiveGroupNames] = useState<string[]>([]);

useEffect(() => {
  if (typeof window !== "undefined") {
    setUser(localStorage.getItem("user_role"));
  }
}, []);

useEffect(() => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === "user_role") {
      setUser(event.newValue);
    }
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);

const makeGroup = () => {
  setGroupOne(true); 
  setGroupTwo(false);
  setGroupThree(false);
  setGroupFour(false);
  setGroupFive(false);

  const activeGroups = ["groupOne"];

  switch (user) {
    case "manager":
      setGroupThree(true);
      setGroupFour(true);
      activeGroups.push("groupThree", "groupFour");
      break;
    case "guest":
      setGroupFive(true);
      activeGroups.push("groupFive");
      break;
    case "be-user":
      setGroupFour(true);
      activeGroups.push("groupFour");
      break;
    case "admin":
      setGroupTwo(true);
      setGroupThree(true);
      setGroupFour(true);
      activeGroups.push("groupTwo", "groupThree", "groupFour");
      break;
    default:
      break;
  }

  return activeGroups; 
};

useEffect(() => {
  if (user) {
    const activeGroups = makeGroup();
    setActiveGroupNames(activeGroups);
  }
}, [user]);

  const value = {
    user,
    setUser,
    groupOne,
    setGroupOne,
    groupTwo,
    setGroupTwo,
    groupThree,
    groupFour,
    setGroupFour,
    groupFive,
    setGroupFive,
    activeGroupNames,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
