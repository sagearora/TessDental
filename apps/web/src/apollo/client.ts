import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  split,
} from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient as createWsClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { refreshTokensIfNeeded } from "@/lib/authTokens";

function getToken(): string | null {
  return localStorage.getItem("accessToken");
}

const hasuraUrl = import.meta.env.VITE_HASURA_URL || "http://127.0.0.1:8080/v1/graphql";
const hasuraWsUrl = import.meta.env.VITE_HASURA_WS_URL || hasuraUrl.replace(/^http/, "ws");

const httpLink = new HttpLink({
  uri: hasuraUrl,
  fetch: async (uri, options) => {
    // Keep the access token fresh on user activity (GraphQL operations).
    try {
      await refreshTokensIfNeeded();
    } catch {
      // If refresh fails, we'll send the request without a token and let
      // downstream auth handling/logouts react to unauthorized responses.
    }

    const token = getToken();
    const headers = new Headers(options?.headers ?? {});
    headers.set("Content-Type", "application/json");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(uri, { ...options, headers, method: "POST" }); // force POST
  },
});

let wsClient: ReturnType<typeof createWsClient> | null = null;

function createWsLink() {
  if (wsClient) {
    wsClient.dispose();
  }
  
  wsClient = createWsClient({
    url: hasuraWsUrl,
    connectionParams: () => {
      const token = getToken();
      return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    },
  });

  return new GraphQLWsLink(wsClient);
}

let wsLink = createWsLink();

export function resetApolloClient() {
  if (wsClient) {
    wsClient.dispose();
    wsClient = null;
  }
  wsLink = createWsLink();
  // Recreate Apollo client with new WS link
  apolloClient.setLink(
    split(
      ({ query }) => {
        const def = getMainDefinition(query);
        return def.kind === "OperationDefinition" && def.operation === "subscription";
      },
      wsLink,
      httpLink
    )
  );
}

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === "OperationDefinition" && def.operation === "subscription";
  },
  wsLink,
  httpLink
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
