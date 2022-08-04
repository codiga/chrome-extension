import React, { CSSProperties, useEffect, useState } from "react";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

import { CODIGA_API_TOKEN, API_URL } from "../../constants";
import { Codiga } from "../Codiga";
import CodigaHeader from "./Header";
import RecipeSearchPanel from "./RecipeSearchPanel";

const httpLink = new HttpLink({
  uri: API_URL,
});

const CodigaDrawer = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();

  const buttonStyle: CSSProperties = {
    position: "fixed",
    right: 0,
    top: "60px",
    background: "#300623",
    cursor: "pointer",
    padding: "0.2rem",
    display: "flex",
    zIndex: 10000,
    border: "none",
    borderRadius: "3px",
    boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  };

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
        }),
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
            style={{ color: "black" }}
            size={600}
            zIndex={20000}
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
