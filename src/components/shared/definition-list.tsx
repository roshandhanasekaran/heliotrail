interface DefinitionListProps {
  items: { label: string; value: React.ReactNode }[];
}

export function DefinitionList({ items }: DefinitionListProps) {
  return (
    <dl className="divide-y divide-border">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between sm:gap-4"
        >
          <dt className="text-sm text-muted-foreground">{item.label}</dt>
          <dd className="text-sm font-medium sm:text-right">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
