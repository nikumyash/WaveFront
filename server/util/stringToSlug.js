const stringToSlug = (str) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/[\W_]+/g, '-')
      .replace(/^-+|-+$/g, '');
};
  
module.exports = stringToSlug;