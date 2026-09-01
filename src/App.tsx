import { About } from './components/About';
import { BrandMark } from './components/BrandMark';
import { Certificates } from './components/Certificates';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Nav } from './components/Nav';
import { NeuralCanvas } from './components/NeuralCanvas';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { ThemeToggle } from './components/ThemeToggle';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <NeuralCanvas />
      <BrandMark />
      <Nav />
      <ThemeToggle />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
