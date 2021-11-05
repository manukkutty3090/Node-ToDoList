exports.getDate = function() {
  const date = new Date();
  return today = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long'
  }).format(date)
};
