import React from 'react'
import PropTypes from 'prop-types'
import { toAbsoluteUrl } from 'src/_ezs/utils/assetPath'
import SVG from 'react-inlinesvg'
import clsx from 'clsx'

function EZSSVG({ className = 'w-8', src, svgClassName }) {
  return (
    <span className={clsx('inline-block', className)}>
      <SVG
        width="100%"
        height="100%"
        src={toAbsoluteUrl(src)}
        className={clsx('w-full', svgClassName)}
      />
    </span>
  )
}

EZSSVG.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string,
  svgClassName: PropTypes.string
}

export { EZSSVG }
