import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import {
  GET_RECIPES_SEMANTIC,
  GET_USER,
  SemanticRecipesResponse,
  UserResponse,
} from "../../graphql/queries";
import { pickLanguage } from "../../replit/picker";
import SnippetCard from "./SnippetCard";

export type SnippetsToSearch = "all" | "private" | "public";

const RecipeSearchPanel = (props: { isOpen: boolean }) => {
  const { isOpen } = props;
  const [searchInput, setSearchInput] = useState<string>("");
  const [snippetsToSearch, setSnippetsToSearch] =
    useState<SnippetsToSearch>("all");
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  const [getRecipesSemantic, { data, loading }] =
    useLazyQuery<SemanticRecipesResponse>(GET_RECIPES_SEMANTIC, {
      variables: {
        term: searchInput ? searchInput : null,
        language: pickLanguage(),
        howmany: 100,
        skip: 0,
        onlyPublic: snippetsToSearch === "public",
        onlyPrivate: snippetsToSearch === "private",
        onlySubscribed: favoriteOnly,
      },
    });

  const [getUser, { data: userData }] =
    useLazyQuery<UserResponse>(GET_USER, {
      variables: {
        term: searchInput ? searchInput : null,
        language: pickLanguage(),
        howmany: 100,
        skip: 0,
        onlyPublic: snippetsToSearch === "public",
        onlyPrivate: snippetsToSearch === "private",
        onlySubscribed: favoriteOnly,
      },
    });

  useEffect(() => {
    if (isOpen) {
      getUser();
      getRecipesSemantic();
    }
  }, [isOpen]);

  const inputBlockStyle = {
    minWidth: "50%",
    padding: "0.2rem",
    alignItems: "center",
    display: "flex",
  };

  const inputStyle = {
    marginRight: "0.3rem",
  };

  return (
    <div style={{ padding: "1rem", overflow: "scroll", maxHeight: "90vh" }}>
      <h2>Code Snippets Search</h2>
      {userData && userData.user && (
        <div>
          Logged as{" "}
          <a
            target="_blank"
            style={{ marginLeft: "0.5rem" }}
            rel="noreferrer"
            href={`https://app.codiga.io/hub/user/${userData.user.accountType.toLowerCase()}/${userData.user.username.toLowerCase()}/assistant`}
          >
            {userData.user.username.toLowerCase()}
          </a>
        </div>
      )}

      {(!userData || !userData.user) && (
        <div>
          Logged as Anonymous User. Configure your API token to access private
          snippets.
        </div>
      )}

      <form>
        {/* register your input into the hook by invoking the "register" function */}

        <DebounceInput
          placeholder="Search for snippets"
          style={{
            width: "100%",
            height: "1.3rem",
            padding: "1rem",
            margin: "0.5rem",
            font: "inherit",
            fontSize: "15px",
          }}
          minLength={2}
          debounceTimeout={300}
          value={searchInput}
          onChange={(field) => setSearchInput(field.target.value)}
        />

        <div style={{ display: "flex", flexWrap: "wrap" }}>
          <div style={inputBlockStyle}>
            <label>
              <input
                type="radio"
                checked={snippetsToSearch === "all"}
                onChange={(e) => {
                  if (e.target.checked) setSnippetsToSearch("all");
                }}
                style={inputStyle}
              />
              All snippets
            </label>
          </div>
          <div style={inputBlockStyle}>
            <label>
              <input
                type="radio"
                checked={snippetsToSearch === "private"}
                onChange={(e) => {
                  if (e.target.checked) setSnippetsToSearch("private");
                }}
                style={inputStyle}
              />{" "}
              Private Snippets Only
            </label>
          </div>
          <div style={inputBlockStyle}>
            <label>
              <input
                type="radio"
                checked={snippetsToSearch === "public"}
                onChange={(e) => {
                  if (e.target.checked) setSnippetsToSearch("public");
                }}
                style={inputStyle}
              />
              Public Snippets Only
            </label>
          </div>
          <div style={inputBlockStyle}>
            <label>
              <input
                type="checkbox"
                checked={favoriteOnly}
                onChange={() => {
                  setFavoriteOnly(!favoriteOnly);
                }}
                style={inputStyle}
              />
              Favorite Snippets Only
            </label>
          </div>
        </div>
      </form>
      <div>
        {data &&
          data.assistantRecipesSemanticSearch &&
          data.assistantRecipesSemanticSearch.length > 0 &&
          data.assistantRecipesSemanticSearch.map((assistantRecipe) => (
            <SnippetCard key={assistantRecipe.id} snippet={assistantRecipe} />
          ))}

        {(!data ||
          !data.assistantRecipesSemanticSearch ||
          data.assistantRecipesSemanticSearch.length === 0) &&
          !loading && <div style={{ marginTop: "1rem" }}>No results found</div>}

        {loading && (
          <div style={{ marginTop: "1rem" }}>Loading snippets...</div>
        )}
      </div>
    </div>
  );
};

export default RecipeSearchPanel;
