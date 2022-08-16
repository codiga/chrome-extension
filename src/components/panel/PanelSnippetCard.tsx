import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import ReactMarkdown from "react-markdown";
import { useMutation } from "@apollo/client";

import {
  SUBSCRIBE_TO_RECIPE,
  UNSUBSCRIBE_FROM_RECIPE,
} from "../../graphql/mutations";
import { Language } from "../../lib/constants";
import { AssistantRecipe } from "../../lib/types";
import { copyToClipboard } from "../../lib/utils";
import Button from "../common/Button";
import PanelSnippetCardCode from "./PanelSnippetCardCode";

import CopyIcon from "../../assets/CopyIcon";
import LockClosedIcon from "../../assets/LockClosedIcon";
import LockOpenedIcon from "../../assets/LockOpenedIcon";
import HeartFilledIcon from "../../assets/HeartFilledIcon";
import HeartEmptyIcon from "../../assets/HeartEmptyIcon";
import UserIcon from "../../assets/UserIcon";
import UsersIcon from "../../assets/UsersIcon";
import BookIcon from "../../assets/BookIcon";

type PanelSnippetCardProps = {
  snippet: AssistantRecipe;
  isUserLoggedIn: boolean;
  language: Language;
};

const PanelSnippetCard = ({
  snippet,
  isUserLoggedIn,
  language,
}: PanelSnippetCardProps) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSnippetSubscribed, setIsSnippetSubscribed] = useState<boolean>(
    snippet.isSubscribed,
  );

  const [subscribeToSnippet] = useMutation(SUBSCRIBE_TO_RECIPE);
  const [unsubscribeFromSnippet] = useMutation(UNSUBSCRIBE_FROM_RECIPE);
  const handleSnippetSubscription = async () => {
    try {
      const id = snippet.id;
      if (isSnippetSubscribed) {
        await unsubscribeFromSnippet({
          variables: { id },
          onCompleted: () => setIsSnippetSubscribed(false),
        });
      } else {
        await subscribeToSnippet({
          variables: { id },
          onCompleted: () => setIsSnippetSubscribed(true),
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // reset the isCopied value after a couple seconds
  useEffect(() => {
    let id: NodeJS.Timeout;
    if (isCopied) id = setTimeout(() => setIsCopied(false), 3000);
    return () => clearTimeout(id);
  }, [isCopied]);

  const code = Buffer.from(snippet.presentableFormat, "base64").toString(
    "utf8",
  );

  return (
    <div className="codiga-panel-content__results--card">
      <div className="card-heading">
        <div className="card-heading--text">
          <h2>{snippet.name}</h2>
          {snippet.isPublic ? <LockOpenedIcon /> : <LockClosedIcon />}
          <button
            className="codiga-subscribe-button"
            onClick={handleSnippetSubscription}
            disabled={!isUserLoggedIn}
            title={
              isUserLoggedIn ? "" : "Please login to favorite this snippet"
            }
          >
            {isSnippetSubscribed ? <HeartFilledIcon /> : <HeartEmptyIcon />}
          </button>
        </div>

        <Button
          variant="secondary"
          shape="square"
          onClick={() => {
            setIsCopied(true);
            copyToClipboard(code);
          }}
        >
          <CopyIcon /> {isCopied ? "Copied" : "Copy"}
        </Button>
      </div>

      <div className="card-subheading">
        <p className="card-subheading--group" title="The snippet owner">
          <UserIcon />
          {snippet.owner.hasSlug && snippet.owner.slug ? (
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://app.codiga.io/hub/user/${snippet.owner.slug}/assistant`.toLowerCase()}
            >
              {snippet.owner.displayName}
            </a>
          ) : (
            <>{snippet.owner.displayName}</>
          )}
        </p>
        {snippet.groups.length > 0 && (
          <p
            className="card-subheading--group"
            title="The group the snippet is in"
          >
            <UsersIcon />
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://app.codiga.io/assistant/group-sharing/${snippet.groups[0].id}/snippets`}
            >
              {snippet.groups[0].name}
            </a>
          </p>
        )}
        {snippet.cookbook && snippet.cookbook.id && (
          <p
            className="card-subheading--group"
            title="The snippet the cookbook is in"
          >
            <BookIcon />
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://app.codiga.io/assistant/cookbook/${snippet.cookbook.id}/view`}
            >
              {snippet.cookbook.name}
            </a>
            <button
              className="codiga-subscribe-button"
              disabled={true}
              title={"Visit this cookbook to favorite it"}
            >
              {snippet.cookbook.isSubscribed && <HeartFilledIcon />}
            </button>
          </p>
        )}
      </div>

      <PanelSnippetCardCode language={language}>{code}</PanelSnippetCardCode>

      <div className="card-info">
        <div className="card-description">
          <ReactMarkdown>{snippet.description}</ReactMarkdown>
        </div>
        <a
          target="_blank"
          rel="noreferrer"
          href={`https://app.codiga.io/assistant/snippet/${snippet.id}/view`}
        >
          View Snippet Now
        </a>
      </div>
    </div>
  );
};

export default PanelSnippetCard;
