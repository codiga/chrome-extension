import React, { useEffect, useState } from "react";
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

import PanelContent from "./PanelContent";
import Header from "../header";
import { ForChromeWithoutCodigaText } from "../common/CodigaForChrome";
import { CODIGA_API_TOKEN, API_URL } from "../../lib/constants";

const httpLink = new HttpLink({
  uri: API_URL,
});

const Panel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();

  const toggleDrawer = () => setIsOpen((prevState) => !prevState);

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
          <button onClick={toggleDrawer} className="codiga-panel-opener">
            <ForChromeWithoutCodigaText />
          </button>

          <Drawer
            open={isOpen}
            onClose={toggleDrawer}
            direction="right"
            size={600}
            zIndex={20000}
            enableOverlay={false}
          >
            <div className="codiga-panel">
              <Header toggleDrawer={toggleDrawer} />
              <PanelContent isOpen={isOpen} />
            </div>
          </Drawer>
        </ApolloProvider>
      )}
    </>
  );
};

export default Panel;
