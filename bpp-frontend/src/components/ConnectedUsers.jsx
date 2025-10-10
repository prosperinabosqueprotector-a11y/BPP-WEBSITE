// ConnectedUsers.jsx
import { useState, useEffect } from "react";
import { Avatar, Box, Typography, Tooltip } from "@mui/material";
import { collection, doc, setDoc, onSnapshot, serverTimestamp, deleteDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../config/firebaseConfig";

export default function ConnectedUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let unsubscribeSnapshot = () => {};
    let currentUserDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Crear referencia del usuario conectado
        currentUserDoc = doc(db, "connectedUsers", user.uid);
        await setDoc(currentUserDoc, {
          displayName: user.displayName || "Explorador",
          photoURL: user.photoURL || `https://api.dicebear.com/6.x/adventurer/svg?seed=${user.displayName}`,
          lastActive: serverTimestamp(),
        });

        // Escuchar cambios en la colección de usuarios conectados
        const q = collection(db, "connectedUsers");
        unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const onlineUsers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setUsers(onlineUsers);
        });

        // Limpiar estado al desconectarse
        window.addEventListener("beforeunload", handleDisconnect);
      }
    });

    const handleDisconnect = async () => {
      if (currentUserDoc) {
        await deleteDoc(currentUserDoc);
      }
    };

    // Cleanup
    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
      window.removeEventListener("beforeunload", handleDisconnect);
      handleDisconnect();
    };
  }, []);

  return (
    <Box display="flex" gap={1} flexWrap="wrap" mb={3}>
      {users.map((u) => (
        <Tooltip key={u.id} title={u.displayName}>
          <Avatar
            src={u.photoURL}
            alt={u.displayName}
            sx={{ width: 40, height: 40, border: "2px solid #4caf50" }}
          />
        </Tooltip>
      ))}
      {users.length === 0 && <Typography variant="body2">Nadie conectado</Typography>}
    </Box>
  );
}
