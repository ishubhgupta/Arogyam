import React from 'react';
import './NaturalTherapy.css'; // Import the CSS file
import TherapyNavbar from '../components/TherapyNavbar';
import { useNavigate } from 'react-router-dom'; // For navigation
import Lottie from 'react-lottie';
import Chatbot from '../public/images/Chatbot.json';

// Import images
import Yoga from '../public/images/dashboard/yoga.jpg';
import Aroma from '../public/images/dashboard/Aroma.jpg';
import Hydro from '../public/images/dashboard/Hydro.jpg';
import Music from '../public/images/dashboard/Music.jpg';
import Ayurveda from '../public/images/dashboard/Ayurveda.jpg';

const cardsData = [
  {
    id: 1,
    image: Yoga, // Use the imported image
    description: "Yoga and Medidation",
    title: "Path Of Peace",
    link: "#"
  },
  {
    id: 2,
    image: Aroma, // Use the imported image
    description: "Aroma Therapy",
    title: "Starry Night",
    link: "#"
  },
  {
    id: 3,
    image: Hydro, // Use the imported image
    description: "Hydro Therapy",
    title: "Path Of Peace",
    link: "#"
  },
  {
    id: 4,
    image: Music, // Use the imported image
    description: "Music Therapy",
    title: "Path Of Peace",
    link: "#"
  },
  {
    id: 5,
    image: Ayurveda, // Use the imported image
    description: "Ayurveda",
    title: "Path Of Peace",
    link: "#"
  }
];

const Card = ({ image, description, title, link }) => {
  return (
    <article className="card__article">
      <img src={image} alt={title} className="card__img" />
      <div className="card__data">
        <span className="card__description">{description}</span>
        <h2 className="card__title">{title}</h2>
        <a href={link} className="card__button">Read More</a>
      </div>
    </article>
  );
};

const App = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to handle chatbot icon click
  const handleChatbotClick = () => {
    navigate('/chatbot'); // Navigate to the chatbot page
  };

  // Lottie options
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Chatbot,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return (
    <div className="page-container">
      <TherapyNavbar />
      <div className="container">
        <div className="heading-container">
          <h1 className="main-heading">Home Remedies</h1>
        </div>
        <div className="card__container">
          {cardsData.map(card => (
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

export default App;