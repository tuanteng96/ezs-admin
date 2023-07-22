import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import 'react-lazy-load-image-component/src/effects/blur.css'
import { toAbsoluteUrl } from 'src/_ezs/utils/assetPath'

const ImageLazy = props => {
  return (
    <LazyLoadImage
      {...props}
      onError={e => {
        if (
          e.target.src !==
          toAbsoluteUrl('/assets/images/files/image-default.png')
        ) {
          e.target.onerror = null
          e.target.src = toAbsoluteUrl('/assets/images/files/image-default.png')
        }
      }}
    />
  )
}

export { ImageLazy }
