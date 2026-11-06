import { useEffect, useState } from "react";

import Header from "./components/Header";
import Hero from "./components/Hero";
import ChairmanMessage from "./components/ChairmanMessage";
import Corporate from "./components/Corporate";
import CorporatePreview from "./components/CorporatePreview";
import Services from "./components/Services";
import ServicesPreview from "./components/ServicesPreview";
import Career from "./components/Career";
import WhyUs from "./components/WhyUs";
import Process from "./components/Process";
import Contact from "./components/Contact";
import QuickContact from "./components/QuickContact";
import VehiclePortfolio from "./components/VehiclePortfolio";
import RentalSection from "./components/RentalSection";
import Footer from "./components/Footer";
import MobileActionBar from "./components/MobileActionBar";
import ScrollTopButton from "./components/ScrollTopButton";
import WhatsAppButton from "./components/WhatsAppButton";

import { translations } from "./data/translations";
import { getDirection } from "./utils/i18n";

export default function App() {
  const [activeView, setActiveView] = useState("home");
  const lang = "tr";
  const t = translations.tr;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = getDirection(lang);
  }, [lang]);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "").toLowerCase();
    const mapping = {
      home: "home",
      kurumsal: "corporate",
      corporate: "corporate",
      faaliyetler: "services",
      services: "services",
      portfoy: "portfolio",
      portfolio: "portfolio",
      kiralama: "rental",
      rental: "rental",
      kariyer: "career",
      career: "career",
      iletisim: "contact",
      contact: "contact",
      hakkimizda: "corporate",
      kurucumuz: "corporate",
      "baskan-mesaji": "corporate",
      degerlerimiz: "corporate",
      "insan-kaynaklari": "corporate",
    };

    setActiveView(mapping[hash] || "home");
  }, []);

  const handleNavigate = (view) => {
    const nextView = view || "home";
    setActiveView(nextView);

    const hashMap = {
      home: "",
      corporate: "kurumsal",
      services: "faaliyetler",
      portfolio: "portfoy",
      rental: "kiralama",
      career: "kariyer",
      contact: "iletisim",
    };

    const nextHash = hashMap[nextView] || "";
    const url = nextHash ? `#${nextHash}` : window.location.pathname + window.location.search;

    window.history.replaceState({}, "", url);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenChairmanMessage = () => {
    setActiveView("corporate");
    window.history.replaceState({}, "", "#baskan-mesaji");
    setTimeout(() => {
      const section = document.getElementById("baskan-mesaji");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 80);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "corporate":
        return <Corporate t={t} onNavigate={handleNavigate} />;
      case "services":
        return <Services t={t} />;
      case "portfolio":
        return <VehiclePortfolio t={t} />;
      case "rental":
        return <RentalSection t={t} />;
      case "career":
        return <Career t={t} />;
      case "contact":
        return <Contact t={t} />;
      default:
        return (
          <div className="space-y-8">
            <WhyUs t={t} />
            <ChairmanMessage t={t} compact onOpen={handleOpenChairmanMessage} />
            <CorporatePreview t={t} onNavigate={handleNavigate} />
            <ServicesPreview t={t} onNavigate={handleNavigate} />
            <Process t={t} />
            <Hero t={t} onNavigate={handleNavigate} />
            <QuickContact t={t} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      <Header t={t} onNavigate={handleNavigate} activeView={activeView} />
      <main className="min-h-screen bg-transparent pb-16 md:pb-0">{renderActiveView()}</main>
      <Footer t={t} onNavigate={handleNavigate} />
      <WhatsAppButton t={t} />
      <ScrollTopButton />
      <MobileActionBar t={t} />
    </div>
  );
}
