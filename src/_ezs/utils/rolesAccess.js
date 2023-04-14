const calendarRole = ({ pos, CrStocks }) => {
  let hasRight = pos?.hasRight
  let StockRoles = pos?.stocks
    ? pos?.stocks.map(x => ({ ...x, label: x.Title, value: x.ID }))
    : []

  if (hasRight && !pos.IsAllStock) {
    hasRight = StockRoles.some(x => x.ID === CrStocks.ID)
  }
  return {
    hasRight,
    StockRoles
  }
}

export const rolesAccess = ({ rightsSum, CrStocks }) => {
  const { pos } = rightsSum
  return {
    calendar: calendarRole({ pos, CrStocks })
  }
}
