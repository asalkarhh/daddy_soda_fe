import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../src/contexts/AuthContext';
import { ToastProvider } from '../src/contexts/ToastContext';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  initialEntries?: MemoryRouterProps['initialEntries'];
}

export function renderWithProviders(
  ui: React.ReactElement,
  { initialEntries = ['/'], ...renderOptions }: ExtendedRenderOptions = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <ToastProvider>
            <AuthProvider>{children}</AuthProvider>
          </ToastProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
}
