import ReactDOM from 'react-dom';
import RecipeSearchForm from './components/RecipeSearchForm';
import React from 'react';
import { CODE_MIRROR_CLASS } from '../constants';

const NOT_DETECTED_SEARCH_BAR_SELECTOR = ":not([detectedSearchBar=true])";
export const addSearchLogicToCodeMirror = () => {
    const codeMirrorList = Array.from(
        document.querySelectorAll(`${CODE_MIRROR_CLASS}${NOT_DETECTED_SEARCH_BAR_SELECTOR}`)
    ).map((element) => element as HTMLElement);
    codeMirrorList.forEach(addSearchBarToCodeMirrorInstance);
}

export const addSearchBarToCodeMirrorInstance = (codeMirror: HTMLElement) => {
    codeMirror.setAttribute("detectedSearchBar", `${true}`);

    const searchBarElement = document.createElement('div');
    codeMirror.parentElement.insertBefore(searchBarElement, codeMirror)
    ReactDOM.render(<RecipeSearchForm />, searchBarElement);
}