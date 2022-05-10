import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import React, { CSSProperties, useEffect, useState } from "react";

import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { CODIGA_API_TOKEN } from "../../constants";
import { Codiga } from "../Codiga";
import CodigaHeader from "./Header";
import RecipeSearchPanel from "./RecipeSearchPanel";

const CODIGA_BASE_URL = "https://api.codiga.io/graphql";

const httpLink = new HttpLink({
  uri: CODIGA_BASE_URL,
});

const CodigaDrawer = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();

  const buttonStyle: CSSProperties = {
    position: "absolute",
    right: 0,
    top: "50px",
    background: "#300623",
    cursor: "pointer",
    padding: "0.2rem",
    display: "flex",
    border: "none",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  };

  // eslint-disable-next-line

  useEffect(() => {
    chrome.storage.sync.get([CODIGA_API_TOKEN], function (obj) {
      const authLink = setContext((_, { headers }) => {
        const token = obj[CODIGA_API_TOKEN];

        // return the headers to the context so httpLink can read them
        return {
          headers: {
            ...headers,
            "X-Api-Token": token || "",
          },
        };
      });

      setClient(
        new ApolloClient({
          link: authLink.concat(httpLink),
          cache: new InMemoryCache(),
        })
      );
    });
  }, []);

  return (
    <>
      {client && (
        <ApolloProvider client={client}>
          <button style={buttonStyle} onClick={toggleDrawer}>
            <Codiga />
          </button>
          <Drawer
            open={isOpen}
            onClose={toggleDrawer}
            direction="right"
            size={600}
            enableOverlay={false}
          >
            <div>
              <CodigaHeader toggleDrawer={toggleDrawer} />
              <RecipeSearchPanel isOpen={isOpen} />
            </div>
          </Drawer>
        </ApolloProvider>
      )}
    </>
  );
};

export default CodigaDrawer;
