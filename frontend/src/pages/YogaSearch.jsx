import React, { useState, useEffect } from "react";
import yogaPoses from "../data/yoga_poses.json";
import "./YogaSearch.css"; // new stylesheet for this page

function YogaSearch() {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [expertiseFilter, setExpertiseFilter] = useState("All"); // new state
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  // Find the default pose (Virabhadrasana C)
  // const defaultFeaturedPose = yogaPoses.find(
  //   (pose) => pose.sanskrit_name === "Virabhadrasana C"
  // );

  /* Updated filtering to search in both name and description */
  // const filteredPoses = yogaPoses.filter((pose) => {
  //   const lowerQuery = query.toLowerCase();
  //   const matchesSearch =
  //     (pose.name && pose.name.toLowerCase().includes(lowerQuery)) ||
  //     (pose.description && pose.description.toLowerCase().includes(lowerQuery));

  //   // Add expertise level filtering
  //   const matchesExpertise =
  //     expertiseFilter === "All" || pose.expertise_level === expertiseFilter;

  //   return matchesSearch && matchesExpertise;
  // });

  // const posesToShow = filteredPoses.slice(0, visibleCount);
  // // Use default pose when no search/filter is active
  // const featuredPose =
  //   query === "" && expertiseFilter === "All"
  //     ? defaultFeaturedPose
  //     : posesToShow[0];
  // const otherPoses =
  //   query === "" && expertiseFilter === "All"
  //     ? posesToShow.filter((pose) => pose !== defaultFeaturedPose)
  //     : posesToShow.slice(1);

  // const handleLoadMore = () => {
  //   setVisibleCount((prev) => prev + 10);
  // };

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      // Simulate a response from a chatbot or Gemini framework
      const response = await fetchGeminiResponse(query);
      setResponse(response);
    }
  };

  const fetchGeminiResponse = async (query) => {
    // Simulate fetching a response from Gemini
    // Replace this with actual Gemini API call if available
    const response = `Based on your query "${query}", here are some recommended yoga poses:`;
    return response;
  };

  return (
    <div className="yoga-search-container">
      <h1>Explore Yoga Poses</h1>
      <div className="search-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by pose name, benefits, or health conditions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        <div className="filter-dropdown">
          <select
            value={expertiseFilter}
            onChange={(e) => setExpertiseFilter(e.target.value)}
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          {featuredPose && (
            <div className="featured-pose" data-aos="fade-up">
              <div className="featured-details">
                <h2>{featuredPose.name}</h2>
                {featuredPose.sanskrit_name && (
                  <p className="sanskrit-name">{featuredPose.sanskrit_name}</p>
                )}
                {featuredPose.expertise_level && (
                  <p className="expertise">
                    Level: {featuredPose.expertise_level}
                  </p>
                )}
                {featuredPose.description && (
                  <p className="description">{featuredPose.description}</p>
                )}
              </div>
              <div className="featured-image">
                <img src={featuredPose.photo_url} alt={featuredPose.name} />
              </div>
            </div>
          )}

          <div className="other-poses-grid">
            {otherPoses.map((pose, index) => (
              <div
                key={index}
                className="pose-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <img
                  src={pose.photo_url}
                  alt={pose.name}
                  className="pose-image"
                />
                <div className="pose-info">
                  <h3>{pose.name}</h3>
                  {pose.sanskrit_name && <p>{pose.sanskrit_name}</p>}
                  {pose.expertise_level && (
                    <p className="expertise">Level: {pose.expertise_level}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!isLoading && visibleCount < filteredPoses.length && (
        <div className="load-more">
          <button onClick={handleLoadMore}>Show More Poses</button>
        </div>
      )}
    </div>
  );
}

export default YogaSearch;
