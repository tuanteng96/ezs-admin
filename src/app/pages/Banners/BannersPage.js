import React, { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import SuspensedView from 'src/app/routing/SuspensedView'

const Lists = lazy(() => import('./pages/Lists'))
const Categories = lazy(() => import('./pages/Categories'))
const CategoriesAdd = lazy(() => import('./pages/CategoriesAdd'))
const AddEdit = lazy(() => import('./pages/AddEdit'))

function BannersPage(props) {
  return (
    <Routes>
      <Route index element={<Navigate to="list" />} />
      <Route
        path="list"
        element={
          <SuspensedView>
            <Lists />
          </SuspensedView>
        }
      >
        <Route path="categories/:id" element={<CategoriesAdd />} />
        <Route path="categories" element={<Categories />} />
        <Route path=":id" element={<AddEdit />} />
      </Route>
    </Routes>
  )
}

export default BannersPage
