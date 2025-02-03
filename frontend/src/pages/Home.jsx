import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bodyPart from '../public/images/Human.json';
import Lottie from 'lottie-react';
import styles from './Home.module.css'; // Import CSS module
import Navbar from '../components/Navbar.jsx';

const TypeWriter = () => {
  const points = [
    "Holistic Healthcare Approach",
    "24/7 Expert Support",
    "Personalized Solutions",
    "Traditional Wisdom"
  ];
  
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    let timer;
    const typeSpeed = 30;  // Faster typing
    const eraseSpeed = 20; // Faster erasing
    const waitTime = 800;  // Shorter wait

    const type = () => {
      const currentPoint = points[currentPointIndex];
      
      if (!isDeleting) {
        if (currentText !== currentPoint) {
          setCurrentText(prev => currentPoint.substring(0, prev.length + 1));
          timer = setTimeout(type, typeSpeed);
        } else {
          timer = setTimeout(() => {
            setIsDeleting(true);
            type();
          }, waitTime);
        }
      } else {
        if (currentText) {
          setCurrentText(prev => prev.substring(0, prev.length - 1));
          timer = setTimeout(type, eraseSpeed);
        } else {
          setIsDeleting(false);
          setCurrentPointIndex(prev => (prev + 1) % points.length);
          timer = setTimeout(type, typeSpeed);
        }
      }
    };

    timer = setTimeout(type, 50);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentPointIndex, points]);

  return <li className={styles.typingPoint}>{currentText || ' '}</li>;
};
const Home = () => {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>Welcome to Our Platform</h1>
          <p className={styles.subheading}>
            Your personal health companion—track, manage, and improve your well-being effortlessly.
          </p>
          <div className={styles.buttons}>
            <Link to="/signup" className={styles.buttonPrimary}>
              Sign Up
            </Link>
            <Link to="/login" className={styles.buttonSecondary}>
              Login
            </Link>
          </div>
        </div>
        <div className={styles.lottieAnimation}>
          <div className={styles.floatingBrain}></div>
          <div className={styles.floatingHeart}></div>
          <div className={styles.floatingLungs1}></div>
          <div className={styles.floatingLungs2}></div>
          <div className={styles.floatingKidney}></div>
          <Lottie animationData={bodyPart} />
        </div>
      </div>
      <div className={styles.featuresWrapper}>
        <h2 className={styles.featureTitle}>Our Features</h2>
        <div className={styles.featureUnderline}></div>
        <div className={styles.featureCards}>
          <div className={`${styles.featureCard} ${styles.cardRed}`}>
            <h3>Empathy Driven Interactions</h3>
          </div>
          <div className={`${styles.featureCard} ${styles.cardBlue}`}>
            <h3>Integration with Natural Therapies</h3>
          </div>
          <div className={`${styles.featureCard} ${styles.cardGreen}`}>
            <h3>Home Remedies (Gharelu Nushke)</h3>
          </div>
          <div className={`${styles.featureCard} ${styles.cardPurple}`}>
            <h3>Proactive Health Maintenance</h3>
          </div>
          <div className={`${styles.featureCard} ${styles.cardOrange}`}>
            <h3>Personalized Emergency First Aid Solution</h3>
          </div>
          <div className={`${styles.featureCard} ${styles.cardYellow}`}>
            <h3>Google Fit Integration</h3>
          </div>
        </div>
      </div>
      <div className={styles.aboutUsSection}>
        <h2 className={styles.aboutTitle}>About Us</h2>
        <div className={styles.aboutUnderline}></div>
        <div className={styles.aboutContent}>
          <div className={styles.aboutLeft}>
            <h3>Our Mission</h3>
            <p>At Arogyam, our mission is to revolutionize healthcare by creating a unified platform that empowers individuals to take charge of their well-being. We aim to consolidate fragmented health data, leverage AI-driven insights for personalized care, and integrate advanced technologies like chatbots for real-time support. By combining holistic health solutions with traditional home remedies, Arogyam bridges the gap between modern medicine and natural therapies to promote healthier lifestyles.</p>
          </div>
          <div className={styles.aboutRight}>
            <div className={styles.aboutCard}>
            <h4>Why Choose Us?</h4>
            <ul>
              <TypeWriter />
            </ul>
            </div>
          </div>
        </div>
      </div>
<div className={styles.contactSection}>
  <h2 className={styles.contactTitle}>Contact Us</h2>
  <div className={styles.contactUnderline}></div>
  <div className={styles.contactContent}>
    <div className={styles.contactLeft}>
      <h3>Get in Touch</h3>
      <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
      <div className={styles.contactInfo}>
        <div className={styles.contactItem}>
          <span>📍</span>
          <p>123 Health Street, Medical District, IN</p>
        </div>
        <div className={styles.contactItem}>
          <span>📧</span>
          <p>contact@arogyam.com</p>
        </div>
        <div className={styles.contactItem}>
          <span>📞</span>
          <p>+1 234 567 8900</p>
        </div>
      </div>
    </div>
    <div className={styles.contactRight}>
      <form className={styles.contactForm}>
        <div className={styles.formGroup}>
          <input type="text" placeholder="Your Name" required />
        </div>
        <div className={styles.formGroup}>
          <input type="email" placeholder="Your Email" required />
        </div>
        <div className={styles.formGroup}>
          <input type="text" placeholder="Subject" required />
        </div>
        <div className={styles.formGroup}>
          <textarea placeholder="Your Message" required></textarea>
        </div>
        <button type="submit" className={styles.submitButton}>
          Send Message
        </button>
      </form>
    </div>
  </div>
</div>
    </>
  );
};

export default Home;