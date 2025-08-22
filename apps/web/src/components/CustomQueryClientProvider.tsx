// In Next.js, this file would be called: app/providers.tsx
"use client";

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  isServer,
} from "@tanstack/react-query";
import { toast } from "sonner";

function makeQueryClient() {
  return new QueryClient({
    ...(!isServer && {
      queryCache: new QueryCache({
        onError: (_error, query) => {
          if (
            query.meta?.errorMessage &&
            typeof query.meta?.errorMessage === "string"
          ) {
            toast.error(query.meta?.errorMessage);
          }
        },
        onSuccess: (_data, query) => {
          if (
            query.meta?.successMessage &&
            typeof query.meta?.successMessage === "string"
          ) {
            toast.success(query.meta?.successMessage);
          }
        },
      }),
    }),
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 5000, // 5 minutes
        //gcTime: 60 * 60 * 1000, // 1 hour
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
    // biome-ignore lint/style/noUselessElse: <explanation>
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function CustomQueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
