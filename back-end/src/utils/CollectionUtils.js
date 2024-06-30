function paginate(array, page, pageSize) {
  // Ensure page and pageSize are positive integers
  if (!page || !pageSize) {
    return array;
  }

  if (page < 1 || pageSize < 1) {
    return array;
  }

  page = parseInt(page, 10);
  pageSize = parseInt(pageSize, 10);

  console.log(page, pageSize)
  const startIndex = (page - 1) * pageSize;
  console.log(startIndex)
  const endIndex = startIndex + pageSize;
  console.log(endIndex)
  return array.slice(startIndex, endIndex);
}

module.exports = {
  paginate
}
