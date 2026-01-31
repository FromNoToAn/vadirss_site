import { useEffect } from 'react';
import { MainHero } from './components/MainHero';
import { StepsProblems } from './components/StepsProblems';
import { RunningLine } from './components/RunningLine';
import { StepsConnect } from './components/StepsConnect';
import { CallToAction } from './components/CallToAction';
import { Gallery11 } from './components/Gallery11';
import { MainLaptop } from './components/MainLaptop';
import { Gallery4 } from './components/Gallery4';
import { Reviews } from './components/Reviews';
import { Advantages } from './components/Advantages';
import { Tariffs } from './components/Tariffs';
import { FAQ } from './components/FAQ';
import { CompanyCard } from './components/CompanyCard';
import { Footer } from './components/Footer';
import { HeaderSocials } from './components/HeaderSocials';

export default function App() {
  useEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0);
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };
    resetScroll();
    requestAnimationFrame(resetScroll);
  }, []);

  return (
    <div className="site-wrapper" tabIndex={0}>
      <MainHero />
      <StepsProblems />
      <RunningLine />
      <StepsConnect />
      <CallToAction id="call-to-action-2" title={<>Первые результаты — через неделю.<div>Конфликтов меньше, мотивации больше.</div></>} buttonText="Подключить бесплатно" bgImage="1442421e-a9f2-4e59-bff3-83bbe39977ea-15595782.png" overlay={0.3} />
      <Gallery11 />
      <MainLaptop />
      <CallToAction id="call-to-action" title="Начните бесплатно — 14 дней полного доступа" buttonText="Начать бесплатно" bgImage="39effd9c-0dfa-4727-ac4d-2aeaebbf0297-15659594.png" overlay={0.3} />
      <Gallery4 />
      <Reviews />
      <Advantages />
      <Tariffs />
      <CallToAction id="call-to-action-3" title="Начните бесплатно — 14 дней полного доступа" buttonText="Написать менеджеру" buttonHref="https://t.me/proffmanagers" bgColor="#111111" />
      <FAQ />
      <CallToAction id="call-to-action-4" title="Начните бесплатно — 14 дней полного доступа" buttonText="Написать менеджеру" buttonHref="https://t.me/proffmanagers" bgColor="#111111" />
      <CompanyCard />
      <Footer />
      <HeaderSocials />
    </div>
  );
}
