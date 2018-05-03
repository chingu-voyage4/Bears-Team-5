export default (articles) => {
  const articlesByCategory = {
    all: articles,
    home: [],
    technology: [],
    culture: [],
    entrepreneurship: [],
    creativity: [],
    self: [],
    politics: [],
    media: [],
    productivity: [],
    design: [],
    popular: [],
    other: []
  };
  articles.forEach(article => (
    articlesByCategory[article.category].push(article)
  ));
  return articlesByCategory;
}