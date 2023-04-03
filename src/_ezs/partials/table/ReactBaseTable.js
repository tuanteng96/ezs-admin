import React from 'react'
import PropTypes from 'prop-types'
import Table, { AutoResizer } from 'react-base-table'
import 'src/_ezs/assets/plugin/react-base-table/react-base-table.css'
import Text from 'react-texty'

ReactBaseTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  loading: PropTypes.bool
}

// const sizePerPageLists = [10, 25, 50, 100, 500, 1000]

function ReactBaseTable({
  columns,
  data,
  onPagesChange,
  loading,
  pageCount,
  rowKey,
  rowRenderer,
  components,
  maxHeight,
  wrapClassName,
  ...props
}) {
  //const tableRef = useRef(null)

  //   useEffect(() => {
  //     tableRef?.current?.scrollToRow(0, 'start')
  //   }, [filters])

  const TableCell = ({ className, cellData }) => (
    <Text tooltipMaxWidth={280} className={className}>
      {cellData}
    </Text>
  )

  const TableHeaderCell = ({ className, column }) => (
    <Text tooltipMaxWidth={280} className={className}>
      {column.title}
    </Text>
  )

  return (
    <div className={wrapClassName}>
      <AutoResizer>
        {({ width, height }) => (
          <Table
            {...props}
            fixed
            rowKey={rowKey}
            width={width}
            height={height}
            columns={columns}
            data={data}
            overlayRenderer={() => (
              <>
                {loading && (
                  <div className="BaseTable-loading">
                    <div className="spinner spinner-primary"></div>
                  </div>
                )}
              </>
            )}
            emptyRenderer={() => !loading && <>Không có dữ liệu</>}
            rowRenderer={rowRenderer}
            components={{ TableCell, TableHeaderCell, ...components }}
            ignoreFunctionInColumnCompare={false}
          />
        )}
      </AutoResizer>
    </div>
  )
}

export default ReactBaseTable
