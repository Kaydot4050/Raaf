import WeatherWidget from '../components/WeatherWidget.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

export default function FarmWeather() {
  usePageMeta('Farm Weather', 'Interactive globe weather for farms across Ghana and Africa.');

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-cream">
      <div className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Weather"
          title="Farm weather"
          description="Explore the globe and check live conditions for farms across Ghana and Africa."
        />
        <div className="mt-8">
          <WeatherWidget />
        </div>
      </div>
    </section>
  );
}
