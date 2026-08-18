"use client";

import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

function useApolloClient() {
  const { getToken } = useAuth();

  return useMemo(() => {
    const httpLink = createHttpLink({
      uri: "http://localhost:4000/graphql",
    });

    const authLink = setContext(async (_, { headers }) => {
      const token = await getToken();
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
    });
  }, [getToken]);
}

export function GraphQLProvider({ children }: { children: React.ReactNode }) {
  const client = useApolloClient();
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
