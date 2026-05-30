import PageHero from './ui/PageHero.jsx';
import { usePageSection } from '../context/ContentContext.jsx';

export default function CmsPageHero({ page, fallback = {}, ...props }) {
  const { data } = usePageSection(page, 'hero', fallback);
  return (
    <PageHero
      eyebrow={data.eyebrow}
      title={data.title}
      description={data.description}
      image={data.image}
      {...props}
    />
  );
}
