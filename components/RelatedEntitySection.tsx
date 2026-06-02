import { type FC, type ReactNode } from "react";

interface RelatedEntitySectionProps {
  title: string;
  children: ReactNode;
}

export const RelatedEntitySection: FC<RelatedEntitySectionProps> = ({ title, children }) => {
  const sectionId = `section-${title.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <section aria-labelledby={sectionId}>
      <h2 id={sectionId} className="text-lg font-semibold text-gray-900 mb-3">
        {title}
      </h2>
      {children}
    </section>
  );
};
