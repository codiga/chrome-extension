import { useLazyQuery } from "@apollo/client";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import { Language } from "../../lib/constants";
import {
  GET_RECIPES_SEMANTIC,
  GET_USER,
  SemanticRecipesResponse,
  UserResponse,
} from "../../graphql/queries";
import { pickLanguage } from "../../pages/replit/picker";
import { LanguageEnumeration } from "../../lib/types";

import PanelLanguageSelect from "./PanelLanguageSelect";
import PanelSnippetCard from "./PanelSnippetCard";

type PanelContentProps = {
  isOpen: boolean;
};

export default function PanelContent({ isOpen }: PanelContentProps) {
  const [searchInput, setSearchInput] = useState<string>("");
  const [privacy, setPrivacy] = useState<"all" | "private" | "public">("all");
  const [favoriteOnly, setFavoriteOnly] = useState<boolean>(false);
  const [language, setLanguage] = useState(Language.LANGUAGE_PYTHON);

  const onLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.currentTarget.value;
    if (selectedLanguage) setLanguage(selectedLanguage as LanguageEnumeration);
  };

  const [getRecipesSemantic, { data, loading }] =
    useLazyQuery<SemanticRecipesResponse>(GET_RECIPES_SEMANTIC, {
      variables: {
        term: searchInput ? searchInput : null,
        language,
        howmany: 100,
        skip: 0,
        onlyPublic: privacy === "public",
        onlyPrivate: privacy === "private",
        onlySubscribed: favoriteOnly,
      },
    });

  const [getUser, { data: userData }] = useLazyQuery<UserResponse>(GET_USER);

  useEffect(() => {
    if (isOpen) {
      getUser();
      setLanguage(Language[pickLanguage()] || Language.LANGUAGE_PYTHON);
      getRecipesSemantic();
    }
  }, [isOpen]);

  const isValidUser = !!(userData && userData.user);

  return (
    <div className="codiga-panel-content">
      <div className="codiga-panel-content__header">
        <h2>Code Snippets Search</h2>
        <p>
          {!isValidUser ? (
            <>
              <a
                target="_blank"
                rel="noreferrer"
                href={"https://app.codiga.io/api-tokens"}
              >
                Configure your API token
              </a>{" "}
              to access your snippets.
            </>
          ) : (
            <>
              Logged in as{" "}
              {userData.user.hasSlug && userData.user?.slug ? (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://app.codiga.io/hub/user/${userData.user.slug}/assistant`.toLowerCase()}
                >
                  {userData.user.username}
                </a>
              ) : (
                userData.user.username
              )}
            </>
          )}
        </p>
      </div>

      <div className="codiga-panel-content__search">
        <div className="codiga-panel-content__search--inputs">
          <DebounceInput
            placeholder="Search snippets..."
            minLength={2}
            debounceTimeout={300}
            value={searchInput}
            onChange={(field) => setSearchInput(field.target.value)}
            style={{ flex: 1 }}
          />

          <PanelLanguageSelect
            useDefault={false}
            language={language}
            onLanguageChange={onLanguageChange}
          />
        </div>

        <div className="codiga-panel-content__search--filters">
          <label className={clsx(!isValidUser && "input-disabled")}>
            <input
              type="radio"
              checked={privacy === "all"}
              onChange={(e) => {
                if (e.target.checked) setPrivacy("all");
              }}
              disabled={!isValidUser}
            />
            All snippets
          </label>
          <label className={clsx(!isValidUser && "input-disabled")}>
            <input
              type="radio"
              checked={privacy === "private"}
              onChange={(e) => {
                if (e.target.checked) setPrivacy("private");
              }}
              disabled={!isValidUser}
            />
            Private snippets only
          </label>
          <label className={clsx(!isValidUser && "input-disabled")}>
            <input
              type="radio"
              checked={privacy === "public"}
              onChange={(e) => {
                if (e.target.checked) setPrivacy("public");
              }}
              disabled={!isValidUser}
            />
            Public snippets only
          </label>
          <label className={clsx(!isValidUser && "input-disabled")}>
            <input
              type="checkbox"
              checked={favoriteOnly}
              onChange={() => setFavoriteOnly((state) => !state)}
              disabled={!isValidUser}
            />
            Favorite snippets/cookbooks only
          </label>
        </div>
      </div>

      <div className="codiga-panel-content__results">
        {/* LOADING STATE */}
        {loading && (
          <div className="codiga-panel-content__results--loading">
            Loading...
          </div>
        )}

        {/* NO RESULTS STATE */}
        {!loading &&
          (!data ||
            !data.assistantRecipesSemanticSearch ||
            data.assistantRecipesSemanticSearch.length === 0) && (
            <div className="codiga-panel-content__results--empty">
              No results found
            </div>
          )}

        {/* FOUND RESULTS STATE */}
        {!loading &&
          data &&
          data.assistantRecipesSemanticSearch &&
          data.assistantRecipesSemanticSearch.length > 0 &&
          data.assistantRecipesSemanticSearch.map((assistantRecipe) => (
            <PanelSnippetCard
              key={assistantRecipe.id}
              snippet={assistantRecipe}
              isUserLoggedIn={isValidUser}
              language={language}
            />
          ))}
      </div>
    </div>
  );
}
