import React, { useState, useEffect } from 'react';
import yogaPoses from '../data/yoga_poses.json';
import './YogaSearch.css';
import TherapyNavbar from '../components/TherapyNavbar';
import Select from 'react-select';

const YogaSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState({ value: 'all', label: 'All Levels' });
  const [selectedType, setSelectedType] = useState({ value: 'all', label: 'All Types' });
  const [filteredPoses, setFilteredPoses] = useState([]);
  const [visiblePoses, setVisiblePoses] = useState(12);
  const [welcomePose, setWelcomePose] = useState(yogaPoses[0]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Filter all poses based on search and filters
    const filtered = yogaPoses.filter((pose) => {
      const matchesSearch =
        pose.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pose.sanskrit_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pose.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel =
        selectedLevel.value === 'all' || pose.expertise_level.toLowerCase() === selectedLevel.value;
      const matchesType =
        selectedType.value === 'all' || (pose.pose_type && pose.pose_type.includes(selectedType.value));

      return matchesSearch && matchesLevel && matchesType;
    });

    if (filtered.length > 0) {
      // Find the best matching pose for the welcome section
      const bestMatch = filtered.find(
        (pose) =>
          pose.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pose.sanskrit_name.toLowerCase().includes(searchTerm.toLowerCase())
      ) || filtered[0];

      setWelcomePose(bestMatch);
      // Remove the welcome pose from filtered list to avoid duplication
      setFilteredPoses(filtered.filter((pose) => pose !== bestMatch));
    } else {
      // If no matches, show default welcome pose
      setWelcomePose(searchTerm ? null : yogaPoses[0]);
      setFilteredPoses([]);
    }
    setIsLoading(false);
  }, [searchTerm, selectedLevel, selectedType]);

  const loadMore = () => {
    setVisiblePoses((prev) => prev + 12);
  };

  const uniqueTypes = [...new Set(yogaPoses.flatMap((pose) => pose.pose_type || []))].sort();

  // Options for dropdowns
  const levelOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    ...uniqueTypes.map((type) => ({ value: type, label: type })),
  ];

  return (
    <>
      <TherapyNavbar />
      <div className="yoga-search">
        <div className="search-header">
          <h1>Discover Yoga Poses</h1>
          <p>Explore a variety of yoga poses suitable for all levels and find the perfect practice for your journey</p>
        </div>

        <div className="search-filters">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for yoga poses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <Select
              options={levelOptions}
              value={selectedLevel}
              onChange={(selectedOption) => setSelectedLevel(selectedOption)}
              placeholder="Select Level"
              className="react-select-container"
              classNamePrefix="react-select"
            />

            <Select
              options={typeOptions}
              value={selectedType}
              onChange={(selectedOption) => setSelectedType(selectedOption)}
              placeholder="Select Type"
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        </div>

        <div className="poses-grid">
          {isLoading ? (
            <div className="loading">Loading poses...</div>
          ) : (
            <>
              {/* Dynamic Welcome Pose */}
              {welcomePose && (
                <div className="pose-card welcome-pose">
                  <div className="pose-image">
                    <img src={welcomePose.photo_url} alt={welcomePose.name} />
                    <div className="pose-level">{welcomePose.expertise_level}</div>
                  </div>
                  <div className="pose-info">
                    <h3>{welcomePose.name}</h3>
                    <h4>{welcomePose.sanskrit_name}</h4>
                    <p>{welcomePose.description}</p>
                    <div className="pose-types">
                      {welcomePose.pose_type &&
                        welcomePose.pose_type.map((type, i) => (
                          <span key={i} className="pose-type-tag">
                            {type}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Regular Poses Grid */}
              {filteredPoses.slice(0, visiblePoses).map((pose, index) => (
                <div key={index} className="pose-card">
                  <div className="pose-image">
                    <img src={pose.photo_url} alt={pose.name} />
                    <div className="pose-level">{pose.expertise_level}</div>
                  </div>
                  <div className="pose-info">
                    <h3>{pose.name}</h3>
                    <h4>{pose.sanskrit_name}</h4>
                    <p>{pose.description}</p>
                    <div className="pose-types">
                      {pose.pose_type &&
                        pose.pose_type.map((type, i) => (
                          <span key={i} className="pose-type-tag">
                            {type}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {filteredPoses.length > visiblePoses && (
          <div className="load-more">
            <button onClick={loadMore}>Load More Poses</button>
          </div>
        )}

        {filteredPoses.length === 0 && !isLoading && searchTerm && !welcomePose && (
          <div className="no-results">
            <p>No poses found matching your search criteria.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default YogaSearch;