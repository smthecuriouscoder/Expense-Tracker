import React from "react";
import Header from "../components/Header/Header";
import Body from "../components/Body/Body";
import Footer from "../components/Footer/Footer";

function LandingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <Body />
      <Footer />
    </div>
  );
}

export default LandingPage;
