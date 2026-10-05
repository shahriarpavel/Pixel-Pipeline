import { useReveal } from './hooks/useReveal';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PipelineStudio from './components/PipelineStudio';
import FeatureGrid from './components/FeatureGrid';
import TechTerminal from './components/TechTerminal';
import IntegrationLogos from './components/IntegrationLogos';
import Footer from './components/Footer';
import CursorTrail from './components/CursorTrail';

function App() {
  useReveal();

  return (
    <>
      <div className="scanlines"></div>
      <div className="grid-overlay"></div>
      <CursorTrail />
      
      <Navbar />
      <Hero />
      <PipelineStudio />
      <FeatureGrid />
      <TechTerminal />
      <IntegrationLogos />
      <Footer />
    </>
  );
}

export default App;
