interface SectionProps {
  id: string;
  num: string;
  label: string;
  title: string;
  screenLabel: string;
  children: React.ReactNode;
}

export default function Section({ id, num, label, title, screenLabel, children }: SectionProps) {
  return (
    <section id={id} className="sec" data-screen-label={screenLabel}>
      <div className="sec-head">
        <span className="sec-num">{num}</span>
        <span className="sec-label">{label}</span>
        <span className="sec-rule" />
      </div>
      <h2 className="sec-title">{title}</h2>
      <div className="sec-body">{children}</div>
    </section>
  );
}
