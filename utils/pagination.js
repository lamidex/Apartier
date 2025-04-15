const paginateResults = (page, limit) => {
    const offset = (page - 1) * limit;
    return {
      limit,
      offset
    };
  };
  
  const formatPaginationResponse = (data, page, limit) => {
    return {
      data: data.rows,
      pagination: {
        totalItems: data.count,
        totalPages: Math.ceil(data.count / limit),
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(data.count / limit),
        hasPreviousPage: page > 1
      }
    };
  };
  
  module.exports = {
    paginateResults,
    formatPaginationResponse
  };