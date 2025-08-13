import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  children?: ReactNode;
}

export default function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-2xl font-semibold leading-6 text-gray-900">{title}</h3>
        <div className="mt-3 sm:ml-4 sm:mt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
