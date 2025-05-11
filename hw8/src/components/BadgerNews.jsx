import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import BadgerTabs from './navigation/BadgerTabs';
import CS571 from '@cs571/mobile-client';
import { BadgerNewsContext } from './BadgerNewsContext.jsx';
export default function BadgerNews(props) {

  // Just a suggestion for Step 4! Maybe provide this to child components via context...

  //preferences object
  const [prefs, setPrefs] = useState({});

  //list of tags
  const [tags, setTags] = useState([]);

  //list of articles
  const [articles, setArticles] = useState([]);

  //fetch all articles, then load tags into a set and filter based on initial prefs
  useEffect(() => {
    fetch('https://cs571api.cs.wisc.edu/rest/s25/hw8/articles', {
      headers: {
        'X-CS571-ID': CS571.getBadgerId(),
      },
    })
    .then(response => response.json())
    .then(data => {
      const articleTags = new Set();

      data.forEach(article => {
        article.tags.forEach(tag => articleTags.add(tag));
      });
      setTags(Array.from(articleTags));

      const initialPrefs = Array.from(articleTags).reduce((acc, tag) => {
        acc[tag] = true;
        return acc;
      }, {});
      setPrefs(initialPrefs);
      setArticles(data);
    });
  }, []);

  //use state vars to set context for use elsewhere
  return (
    <BadgerNewsContext.Provider value={{ prefs, setPrefs, tags, setTags, articles, setArticles }}>
      <NavigationContainer>
        <BadgerTabs />
      </NavigationContainer>
    </BadgerNewsContext.Provider>
  );
}