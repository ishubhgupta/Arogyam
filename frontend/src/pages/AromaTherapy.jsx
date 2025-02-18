import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import aromatherapyData from "../data/aromatherapy_data.json";
import TherapyNavbar from "../components/TherapyNavbar";
import "./AromaTherapy.css";
import { useNavigate } from "react-router-dom";

const AromaTherapy = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedUse, setSelectedUse] = useState("All");

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Extract unique recommended uses
  const allRecommendedUses = ["All", ...new Set(
    aromatherapyData.flatMap(oil => 
      oil["Recommended Uses"].split(", ")
    )
  )];

  const filteredOils = aromatherapyData.filter(
    (oil) => {
      const matchesSearch = 
        oil["Essential Oil"].toLowerCase().includes(query.toLowerCase()) ||
        oil["Benefits"].toLowerCase().includes(query.toLowerCase()) ||
        oil["Properties"].toLowerCase().includes(query.toLowerCase());
      
      const matchesUse = selectedUse === "All" || 
        oil["Recommended Uses"].includes(selectedUse);

      return matchesSearch && matchesUse;
    }
  );

  return (
    <>
      <TherapyNavbar />
      <div className="page-container">
        <div className="modern-wrapper">
          {/* Banner Section */}
          <div className="banner" data-aos="fade-down">
            <h1 className="banner-title">Aroma Therapy</h1>
            <p className="banner-subtitle">
              Discover the healing power of essential oils
            </p>
          </div>
          
          <div className="search-container" data-aos="fade-up">
            <input
              type="text"
              placeholder="Search by oil name, benefits or properties..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button 
              className="routine-btn"
              onClick={() => navigate('/routine-generator')}
            >
              Generate Routine
            </button>

          <div className="tags-container" data-aos="fade-up">
            {allRecommendedUses.map((use) => (
              <button
                key={use}
                className={`tag ${selectedUse === use ? 'active' : ''}`}
                onClick={() => setSelectedUse(use)}
              >
                {use}
              </button>
            ))}
          </div>

          <div className="oil-grid">
            
            
            {filteredOils.map((oil, index) => (
              <div
                key={index}
                className="oil-card modern-card"
                data-aos="fade-up"
                data-aos-delay={index * 20}
              >
                <h2>{oil["Essential Oil"]}</h2>
                <p>
                  <strong>Botanical Name:</strong> {oil["Botanical Name"]}
                </p>
                <p>
                  <strong>Properties:</strong> {oil["Properties"]}
                </p>
                <p>
                  <strong>Benefits:</strong> {oil["Benefits"]}
                </p>
                <p>
                  <strong>Recommended Uses:</strong> {oil["Recommended Uses"]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AromaTherapy;