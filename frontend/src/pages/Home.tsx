import AboutSection from "../components/Home/AboutSection";
import HeroSection from "../components/Home/HeroSection";

const Home = () => {
    return (
        <div className="container mx-auto flex-1 px-5 flex flex-col items-center justify-center text-neutral-content">
            <HeroSection />
            <AboutSection />
        </div>
    );
};

export default Home;
