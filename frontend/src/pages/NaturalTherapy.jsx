import React from "react";
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
    image: Yoga,
    description: "Yoga and Meditation",
    title: "Path Of Peace",
    link: "/yoga-search", // Updated to proper route
  },
  {
    id: 2,
    image: Aroma,
    description: "Aroma Therapy",
    title: "Natural Healing",
    link: "/aroma-therapy",
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
      <img src={image} alt={title} className="card__img" />
      <div className="card__data">
        <span className="card__description">{description}</span>
        <h2 className="card__title">{title}</h2>
        <Link to={link} className="card__button">
          Read More
        </Link>
      </div>
    </article>
  );
};

const NaturalTherapy = () => {
  const navigate = useNavigate();

  const handleChatbotClick = () => {
    navigate("/chatbot");
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
    <div className="page-container">
      <TherapyNavbar />
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
