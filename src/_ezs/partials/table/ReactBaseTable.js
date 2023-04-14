import React from 'react'
import PropTypes from 'prop-types'
import Table, { AutoResizer } from 'react-base-table'
import 'src/_ezs/assets/plugin/react-base-table/react-base-table.css'
import Text from 'react-texty'
import { LoadingComponentFull } from 'src/_ezs/layout/components/loading/LoadingComponentFull'
import { toAbsoluteUrl } from 'src/_ezs/utils/assetPath'

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
  emptyRenderer,
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
              <LoadingComponentFull
                bgClassName="bg-white dark:bg-dark-aside"
                top="top-[50px]"
                height="h-[calc(100%-50px)]"
                loading={loading}
              />
            )}
            emptyRenderer={() =>
              !loading && emptyRenderer ? (
                emptyRenderer
              ) : (
                <div className="flex flex-col items-center justify-center h-full dark:bg-dark-aside">
                  <img
                    className="w-auto max-w-[350px]"
                    src={toAbsoluteUrl('/assets/svg/sketchy/4.png')}
                    alt="EZS - Phần mềm quản lý Spa"
                  />
                </div>
              )
            }
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
