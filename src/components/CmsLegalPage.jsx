import LegalPage from './ui/LegalPage.jsx';
import { usePageSection } from '../context/ContentContext.jsx';

export default function CmsLegalPage({ page, fallback }) {
  const { data } = usePageSection(page, 'main', fallback);
  return (
    <LegalPage
      eyebrow={data.eyebrow}
      title={data.title}
      description={data.description}
      sections={data.sections || []}
    />
  );
}
