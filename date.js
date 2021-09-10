exports.getDate = function() {
  const date = new Date();
  return today = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full'
  }).format(date)
};
