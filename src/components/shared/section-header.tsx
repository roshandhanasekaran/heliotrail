interface SectionHeaderProps {
  title: string;
  description?: string;
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="font-sans text-2xl font-bold tracking-tight text-[#0D0D0D]">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-[#737373]">{description}</p>
      )}
    </div>
  );
}
