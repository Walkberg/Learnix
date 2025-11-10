import type { ReactNode } from 'react';

export const DialogTitle = ({ children }: { children: ReactNode }) => {
  return <h2 className="text-pretty text-xl font-bold text-dark">{children}</h2>;
};
