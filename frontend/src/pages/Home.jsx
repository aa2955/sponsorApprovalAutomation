import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import "../styles/Home.css";

export default function Home() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  // Update user state when localStorage changes (e.g., logout)
  useEffect(() => {
    const updateUser = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
    };

    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  return (
    <>
      <Navbar currentPage="home" />

      <div className="home page">
        <div className="col long">
          <h1>
            <span>Welcome</span>
            <AnimatePresence>
              {user && (
                <motion.span
                  key="welcome-msg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    display: "block",
                    fontSize: "1.2rem",
                    marginTop: "0.5rem",
                  }}
                >
                  👋 Welcome back, {user.first_name}!
                </motion.span>
              )}
            </AnimatePresence>
          </h1>

          <div>
            This page can be changed to give instructions to students or contain important course links or deadlines.
          </div>
          <div>
            Lorem ipsum dolor sit amet...
          </div>
        </div>
        <div className="col">
          <img
            src="https://cdn3d.iconscout.com/3d/premium/thumb/gear-3d-icon-download-in-png-blend-fbx-gltf-file-formats--setting-settings-cogwheel-configuration-technology-pack-science-icons-4940527.png?f=webp"
            alt="transparent png of a gear"
          />
        </div>
      </div>
    </>
  );
}
