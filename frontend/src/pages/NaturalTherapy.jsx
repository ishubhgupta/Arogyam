import React from 'react';
import './index.css'; // Import the CSS file

// Import images
import ArogyamImage from '../public/images/dashboard/Arogyam.png'; // Adjust the path as needed
import Yoga from '../public/images/dashboard/yoga.jpg'
import Aroma from '../public/images/dashboard/Aroma.jpg'
import Hydro from '../public/images/dashboard/Hydro.jpg'

const cardsData = [
  {
    id: 1,
    image: Yoga, // Use the imported image
    description: "Vancouver Mountains, Canada",
    title: "The Great Path",
    link: "#"
  },
  {
    id: 2,
    image: Aroma, // Use the imported image
    description: "Poon Hill, Nepal",
    title: "Starry Night",
    link: "#"
  },
  {
    id: 3,
    image: Hydro, // Use the imported image
    description: "Bojcin Forest, Serbia",
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
  return (
    <div className="container">
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
  );
};

export default App;