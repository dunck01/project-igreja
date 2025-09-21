import Header from '../components/layout/Header';
import Hero from '../components/layout/Hero';
import About from '../components/pages/About';
import Services from '../components/pages/Services';
import Events from '../components/pages/Events';
import Families from '../components/pages/Families';
import Gallery from '../components/pages/Gallery';
import Media from '../components/pages/Media';
import Testimonials from '../components/pages/Testimonials';
import Contact from '../components/pages/Contact';
import Footer from '../components/layout/Footer';

const LandingPage = () => {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Services />
      <Events />
      <Families />
      <Gallery />
      <Media />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  );
};

export default LandingPage;