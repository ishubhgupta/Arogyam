import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bodyPart from '../public/images/Human.json';
import Lottie from 'lottie-react';
import styles from './Home.module.css'; // Import CSS module
import Navbar from '../components/Navbar.jsx';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faLinkedinIn 
} from '@fortawesome/free-brands-svg-icons';


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
  const [overlayData, setOverlayData] = useState(null);
  const overlayTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // Dismiss overlay when clicking outside overlay
  useEffect(() => {
    const handleClickOutside = () => setOverlayData(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleOverlay = (data, e) => {
    e.stopPropagation();
    if (overlayTimeoutRef.current) {
      clearTimeout(overlayTimeoutRef.current);
      overlayTimeoutRef.current = null;
    }
    // Only update if overlayData differs
    if (!overlayData || overlayData.heading !== data.heading) {
      setOverlayData(data);
    }
  };

  const hideOverlay = () => {
    overlayTimeoutRef.current = setTimeout(() => setOverlayData(null), 300);
  };

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
          {/* <div className={styles.floatingBrain}></div>
          <div className={styles.floatingHeart}></div>
          <div className={styles.floatingLungs1}></div>
          <div className={styles.floatingLungs2}></div>
          <div className={styles.floatingKidney}></div> */}
          <Lottie animationData={bodyPart} />
        </div>
      </div>
      <div className={styles.featuresWrapper}>
        <h2 className={styles.featureTitle}>Our Features</h2>
        <div className={styles.featureUnderline}></div>
        <div className={styles.honeycomb} onClick={e => e.stopPropagation()}>
          <div
            className={`${styles.hexagon} ${styles.center}`}
          >
            Arogyam
          </div>
          <div
            className={`${styles.hexagon} ${styles.top}`}
            onMouseEnter={e =>
              handleOverlay(
                { 
                  heading: 'Empathy Driven Interactions', 
                  description: 'Experience compassionate service.',
                  color: 'linear-gradient(135deg,rgba(248, 136, 136, 0.84),rgba(255, 26, 26, 0.83))'
                },
                e
              )
            }
          >
            Empathy Driven Interactions
          </div>
          <div
            className={`${styles.hexagon} ${styles.topRight}`}
            onMouseEnter={e =>
              handleOverlay(
                { 
                  heading: 'Integration with Natural Therapies', 
                  description: 'Seamless integration of natural remedies.', 
                  color: 'linear-gradient(135deg,rgba(131, 199, 255, 0.84),rgba(25, 118, 210, 0.84))'
                },
                e
              )
            }
          >
            Integration with Natural Therapies
          </div>
          <div
            className={`${styles.hexagon} ${styles.bottomRight}`}
            onMouseEnter={e =>
              handleOverlay(
                { 
                  heading: 'Home Remedies (Gharelu Nushke)', 
                  description: 'Traditional and simple solutions.',
                  color: 'linear-gradient(135deg,rgba(133, 255, 137, 0.82),rgba(56, 142, 60, 0.82))'
                },
                e
              )
            }
          >
            Home Remedies (Gharelu Nushke)
          </div>
          <div
            className={`${styles.hexagon} ${styles.bottom}`}
            onMouseEnter={e =>
              handleOverlay(
                { 
                  heading: 'Proactive Health Maintenance', 
                  description: 'Stay ahead with proactive care.', 
                  color: 'linear-gradient(135deg,rgba(236, 130, 255, 0.81),rgba(123, 31, 162, 0.84))'
                },
                e
              )
            }
          >
            Proactive Health Maintenance
          </div>
          <div
            className={`${styles.hexagon} ${styles.bottomLeft}`}
            onMouseEnter={e =>
              handleOverlay(
                { 
                  heading: 'Personalized Emergency First Aid Solution', 
                  description: 'Immediate help when needed.',
                  color: 'linear-gradient(135deg,rgba(255, 205, 130, 0.83),rgba(245, 123, 0, 0.78))'
                },
                e
              )
            }
          >
            Personalized Emergency First Aid Solution
          </div>
          <div
            className={`${styles.hexagon} ${styles.topLeft}`}
            onMouseEnter={e =>
              handleOverlay(
                { 
                  heading: 'Google Fit Integration', 
                  description: 'Sync your health data effortlessly.',
                  color: 'linear-gradient(135deg,rgba(255, 234, 130, 0.84),rgba(255, 196, 0, 0.84))'
                },
                e
              )
            }
          >
            Google Fit Integration
          </div>
          {overlayData && (
            <div 
              className={styles.featureOverlay} 
              onClick={e => e.stopPropagation()}
              onMouseEnter={() => {
                if (overlayTimeoutRef.current) {
                  clearTimeout(overlayTimeoutRef.current);
                  overlayTimeoutRef.current = null;
                }
              }}
              onMouseLeave={hideOverlay}
              style={{ background: overlayData.color, backdropFilter: 'blur(4px)', filter: 'brightness(1.2)' }}
            >
              <div className={styles.overlayContent}>
                <h3>{overlayData.heading}</h3>
                <p>{overlayData.description}</p>
                <button
                  className={styles.overlayButton}
                  onClick={() => navigate('/login')}
                >
                  Login
                </button>
              </div>
            </div>
          )}
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
<footer className={styles.footer}>
  <div className={styles.footerContent}>
    <div className={styles.footerSection}>
      <h4>Arogyam</h4>
      <p>Empowering health and wellness through holistic solutions and modern technology.</p>
      <div className={styles.socialLinks}>
  <a href="#" aria-label="Facebook">
    <FontAwesomeIcon icon={faFacebookF} />
  </a>
  <a href="#" aria-label="Twitter">
    <FontAwesomeIcon icon={faTwitter} />
  </a>
  <a href="#" aria-label="Instagram">
    <FontAwesomeIcon icon={faInstagram} />
  </a>
  <a href="#" aria-label="LinkedIn">
    <FontAwesomeIcon icon={faLinkedinIn} />
  </a>
</div>
    </div>
    
    <div className={styles.footerSection}>
      <h4>Quick Links</h4>
      <ul>
        <li><Link to="/about">About Us</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/blog">Blog</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
    </div>
    
    <div className={styles.footerSection}>
      <h4>Services</h4>
      <ul>
        <li><Link to="/natural-therapy">Natural Therapy</Link></li>
        <li><Link to="/yoga">Yoga</Link></li>
        <li><Link to="/meditation">Meditation</Link></li>
        <li><Link to="/diet-plans">Diet Plans</Link></li>
      </ul>
    </div>
    
    <div className={styles.footerSection}>
      <h4>Newsletter</h4>
      <p>Subscribe to our newsletter for health tips and updates.</p>
      <form className={styles.newsletterForm}>
        <input type="email" placeholder="Enter your email" />
        <button type="submit">Subscribe</button>
      </form>
    </div>
  </div>
  
  <div className={styles.footerBottom}>
    <p>&copy; {new Date().getFullYear()} Arogyam. All rights reserved.</p>
    <div className={styles.footerLinks}>
      <Link to="/privacy">Privacy Policy</Link>
      <Link to="/terms">Terms of Service</Link>
      <Link to="/sitemap">Sitemap</Link>
    </div>
  </div>
</footer>
    </>
  );
};

export default Home;