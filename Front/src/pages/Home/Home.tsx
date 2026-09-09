import { Navbar } from "../../components/Navbar/Navbar";
import { Hero } from "../../components/Hero/Hero";
import { Services } from "../../components/Services/Services";
import { Gallery } from "../../components/Gallery/Gallery";
import { Booking } from "../../components/Booking/Booking";
import { Footer } from "../../components/Footer/Footer";
import { WhatsAppButton } from "../../components/WhatsAppButton/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Services />
        <Gallery />
        <Booking />
      </main>

      <Footer />

      <WhatsAppButton />
    </>
  );
}
