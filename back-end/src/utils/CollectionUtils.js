function paginate(array, page, pageSize) {
  // Ensure page and pageSize are positive integers
  if (!page || !pageSize) {
    return array;
  }

  if (page < 1 || pageSize < 1) {
    return array;
  }

  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return array.slice(startIndex, endIndex);
}

module.exports = {
  paginate
}
