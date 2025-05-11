import { createContext } from 'react';


//create context for articles and preferences, to filter by preference
export const BadgerNewsContext = createContext({
    prefs: {},
    setPrefs: () => {},
    tags: [],
    setTags: () => {},
    articles: [],
    setArticles: () => {}
});