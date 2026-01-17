import React from "react";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext";
import Navigation from "./components/Navigation";
import HomePage from "./pages/HomePage";
import FollowersPage from "./pages/FollowersPage";
import FollowedPage from "./pages/FollowedPage";
import FeedPage from "./pages/FeedPage";
import PublishPage from "./pages/PublishPage";

function App() {
  return (
    <>
      <UserProvider>
        <Navigation />
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/users/:userId/followers"
              element={<FollowersPage />}
            />
            <Route path="/users/:userId/followed" element={<FollowedPage />} />
            <Route path="/users/:userId/feed" element={<FeedPage />} />
            <Route path="/publish" element={<PublishPage />} />
          </Routes>
        </div>
      </UserProvider>
    </>
  );
}

export default App;
