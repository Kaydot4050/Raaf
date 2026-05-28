import { SectionHeader } from './ui/SectionReveal.jsx';

export default function SectionTitle({ eyebrow, title, description, align = 'center' }) {
  return <SectionHeader eyebrow={eyebrow} title={title} description={description} align={align} />;
}
