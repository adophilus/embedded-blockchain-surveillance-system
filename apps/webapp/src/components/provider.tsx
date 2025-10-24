import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { FunctionComponent, ReactNode } from "react";

const queryClient = new QueryClient();

export const Provider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
