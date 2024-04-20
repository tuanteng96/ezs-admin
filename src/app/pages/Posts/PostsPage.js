import React, { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { useRoles } from 'src/_ezs/hooks/useRoles'
import { RoleAccess } from 'src/_ezs/layout/RoleAccess'
import SuspensedView from 'src/app/routing/SuspensedView'

const Lists = lazy(() => import('./pages/Lists'))
const Categories = lazy(() => import('./pages/Categories'))
const CategoriesAdd = lazy(() => import('./pages/CategoriesAdd'))
const AddEdit = lazy(() => import('./pages/AddEdit'))
const Filters = lazy(() => import('./pages/Filters'))

function PostsPage(props) {
  const { article } = useRoles(['article'])

  return (
    <Routes>
      <Route element={<RoleAccess roles={article.hasRight} />}>
        <Route index element={<Navigate to="list" />} />
        <Route
          path="list"
          element={
            <SuspensedView>
              <Lists />
            </SuspensedView>
          }
        >
          <Route path="filter" element={<Filters />} />
          <Route path="categories/:id" element={<CategoriesAdd />} />
          <Route path="categories" element={<Categories />} />
          <Route path=":id" element={<AddEdit />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default PostsPage
