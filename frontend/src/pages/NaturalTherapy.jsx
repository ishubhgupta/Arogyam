import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NaturalTherapy.css";
import Navbar from '../components/Navbar.jsx';

const NaturalTherapy = () => {
  const navigate = useNavigate();
  const [activeTherapy, setActiveTherapy] = useState(null);

  const therapies = [
    {
      title: "Nutritional Therapy",
      description:
        "Nutritional therapy allows patients to eat according to certain recipes or supplement certain nutrients, making diet a means of treatment. It is the basis of natural therapy and is widely used to treat conditions like acne, arthritis, and diabetes.",
    },
    {
      title: "Phototherapy",
      description:
        "Phototherapy uses plants as medicines to prevent and cure diseases. Modern naturopathic doctors rely on both traditional medicinal properties and modern pharmacological effects of plants.",
    },
    {
      title: "Acupuncture Therapy",
      description:
        "Acupuncture therapy, derived from Chinese medicine, stimulates the body’s acupoints through acupuncture, massage, laser, or electrical stimulation.",
    },
    {
      title: "Hydrotherapy",
      description:
        "Hydrotherapy uses water in various forms, such as hot water, cold water, and steam, to protect health or prevent diseases. Methods include baths, saunas, and hot compresses.",
    },
  ];

  const handleTherapyClick = (index) => {
    setActiveTherapy(activeTherapy === index ? null : index);
  };

  return (
    <>
      <Navbar />
    <div className="natural-therapy-page">
      <h1>Natural Therapy</h1>
      <p>
        Natural therapy focuses on using natural remedies and holistic approaches
        to improve health and well-being. It includes practices like herbal
        medicine, acupuncture, yoga, and meditation.
      </p>
      <p>
        Explore the benefits of natural therapy and learn how to incorporate it
        into your daily life for a healthier, more balanced lifestyle.
      </p>

      <div className="therapy-container">
        {therapies.map((therapy, index) => (
          <div
            key={index}
            className={`therapy-box ${activeTherapy === index ? "active" : ""}`}
            onClick={() => handleTherapyClick(index)}
          >
            <h3>{therapy.title}</h3>
            <div className="therapy-description">{therapy.description}</div>
          </div>
        ))}
      </div>

      <button onClick={() => navigate("/dashboard")} className="back-btn">
        Back to Dashboard
      </button>
    </div>
    </>
  );
};

export default NaturalTherapy;