import React, { useState } from 'react';
import "./NaturalTherapy.css";
import TherapyNavbar from "../components/TherapyNavbar";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "react-lottie";
import Chatbot from "../public/images/Chatbot.json";

// Import images
import Yoga from "../public/images/dashboard/yoga.jpg";
import Aroma from "../public/images/dashboard/Aroma.jpg";
import Hydro from "../public/images/dashboard/Hydro.jpg";
import Music from "../public/images/dashboard/Music.jpg";
import Ayurveda from "../public/images/dashboard/Ayurveda.jpg";

const cardsData = [
  {
    id: 1,
    image: Aroma,
    description: "Aroma Therapy",
    title: "Natural Healing",
    link: "/aroma-therapy",
  },
  {
    id: 2,
    image: Yoga,
    description: "Path and Peace",
    title: "Yoga and Meditation",
    link: "/yoga-search", // Updated to proper route
  },
  {
    id: 3,
    image: Hydro,
    description: "Hydro Therapy",
    title: "Water Healing",
    link: "/hydro-therapy",
  },
  {
    id: 4,
    image: Music,
    description: "Music Therapy",
    title: "Sound Healing",
    link: "/music-therapy",
  },
  {
    id: 5,
    image: Ayurveda,
    description: "Ayurveda",
    title: "Ancient Wisdom",
    link: "/ayurveda",
  },
];

const Card = ({ image, description, title, link }) => {
  return (
    <article className="card__article">
      <div className="card__image-container">
        <img src={image} alt={title} className="card__img" />
        <div className="card__overlay"></div>
      </div>
      <div className="card__data">
        <span className="card__description">{description}</span>
        <h2 className="card__title">{title}</h2>
        <Link to={link} className="card__button">
          Explore
          <svg className="card__button-icon" viewBox="0 0 24 24">
            <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z"/>
          </svg>
        </Link>
      </div>
    </article>
  );
};

const NaturalTherapy = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleChatbotClick = () => {
    navigate("/chatbot");
  };

  const handleMenuState = (state) => {
    setIsMenuOpen(state);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Chatbot,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className={`page-container ${isMenuOpen ? 'menu-active' : ''}`}>
      <TherapyNavbar onMenuToggle={handleMenuState} />
      <div className="container">
        <div className="heading-container">
          <h1 className="main-heading">Natural Therapies</h1>
        </div>
        <div className="card__container">
          {cardsData.map((card) => (
            <Card
              key={card.id}
              image={card.image}
              description={card.description}
              title={card.title}
              link={card.link}
            />
          ))}
        </div>
      </div>
      <div className="chatbot-icon" onClick={handleChatbotClick}>
        <Lottie options={defaultOptions} height={100} width={100} />
      </div>
    </div>
  );
};

export default NaturalTherapy;
