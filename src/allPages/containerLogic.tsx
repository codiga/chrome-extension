import ReactDOM from 'react-dom';
import RecipeSearchForm from './components/RecipeSearchForm';
import React from 'react';

export const addSearchLogicToCodeMirror = () => {
    const codeMirrorList = Array.from(
        document.querySelectorAll(".CodeMirror:not([detectedSearchBar=true])")
    ).map((element) => element as HTMLElement);
    codeMirrorList.forEach(addSearchBarToCodeMirrorInstance);
}

export const addSearchBarToCodeMirrorInstance = (codeMirror: HTMLElement) => {
    codeMirror.setAttribute("detectedSearchBar", `${true}`);

    const searchBarElement = document.createElement('div');
    codeMirror.parentElement.insertBefore(searchBarElement, codeMirror)
    ReactDOM.render(<RecipeSearchForm />, searchBarElement);
}