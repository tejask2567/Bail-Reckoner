import React, { useState } from "react";
import "./Home.css";
import Footer from "../Footer/Footer";
import main from "../../assests/images/main.png";
import DatawrapperChart from "./charts";
import DatawrapperChart_2 from "./Charts_2";
import { useNavigate } from "react-router-dom";
import GeminiChatbox from "./GeminiChatbox";

const Home = () => {
  const [isChatboxOpen, setIsChatboxOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="home-container relative">
      {/* Existing home page content */}
      <section className="page-section hero-section">
        <div className="hero-content">
          {/* Left Column - Vector */}
          <div className="hero-vector">
            <img src={main} alt="Main Illustration" />
          </div>

          {/* Right Column - Facts */}
          <div className="hero-facts">
            <h1>Understanding Bail</h1>
            <p>
              Bail in India is a legal provision that allows a person accused of
              a crime to be released from custody while they await trial. This
              is not a judgment of innocence or guilt, but rather a way to
              ensure that individuals are not held in detention unnecessarily
              while the legal process unfolds.
            </p>
            <p>
              The Indian legal system grants the right to bail with the
              understanding that the accused will appear before the court for
              all hearings and proceedings. However, bail can be denied in
              certain circumstances, particularly in cases involving serious
              offenses or if there is a risk that the accused may flee, tamper
              with evidence, or influence witnesses.
            </p>
            <a href="login/lawyer">
              <button className="hero-cta" onClick={navigate("/login/lawyer")}>
                Apply for bail
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Second Page */}
      <section className="page-section second-page" id="analytics">
        <div className="Charts">
          <DatawrapperChart />
          <DatawrapperChart_2 />
        </div>
      </section>

      {/* Third Page - About Us */}
      <section className="page-section third-page about-page" id="about-us">
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            Welcome to <strong>Bail Reckoner</strong>, a cutting-edge digital
            platform designed to revolutionize the bail application process in
            India. Developed by <strong>Team Dora the Explorer</strong> for the
            prestigious <strong>Smart India Hackathon (SIH) 2024</strong>, in
            collaboration with the Ministry of Law and Justice, our platform
            leverages advanced AI models and Large Language Models (LLMs) to
            streamline and modernize the bail process for all stakeholders.
          </p>
          <div className="video-content-box">
            <div className="video-container">
              <iframe
                src="https://www.youtube.com/embed/4yFbRkF2XnU?si=9Rlc2Z-iEFl6V5Jz&amp;start=5"
                title="YouTube Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="text-content">
              <h3>Video Overview</h3>
              <p>
                This video provides an overview of the functionalities and goals
                of the Bail Reckoner platform. Explore how technology is
                reshaping the bail application process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chatbox Container */}
      <div
        className={`chatbox-container ${isChatboxOpen ? "block" : "hidden"}`}
      >
        <div className="fixed bottom-24 left-8 w-96 z-[2001]">
          <GeminiChatbox />
        </div>
      </div>
    </div>
  );
};

export default Home;
