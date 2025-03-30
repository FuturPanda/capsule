/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LoginOldImport } from './routes/loginOld'
import { Route as LoginImport } from './routes/login'
import { Route as AuthenticatedImport } from './routes/_authenticated'
import { Route as AuthenticatedIndexImport } from './routes/_authenticated/index'
import { Route as AuthenticatedQueryIndexImport } from './routes/_authenticated/query/index'
import { Route as AuthenticatedDataIndexImport } from './routes/_authenticated/data/index'
import { Route as AuthenticatedCapletsIndexImport } from './routes/_authenticated/caplets/index'
import { Route as AuthenticatedAccountIndexImport } from './routes/_authenticated/account/index'
import { Route as AuthenticatedModelsModelImport } from './routes/_authenticated/models/$model'
import { Route as AuthenticatedDataDatabaseIdImport } from './routes/_authenticated/data/$databaseId'
import { Route as AuthenticatedCapletsCapletIdImport } from './routes/_authenticated/caplets/$capletId'
import { Route as AuthenticatedDataDatabaseIdTableNameImport } from './routes/_authenticated/data/$databaseId.$tableName'

// Create/Update Routes

const LoginOldRoute = LoginOldImport.update({
  path: '/loginOld',
  getParentRoute: () => rootRoute,
} as any)

const LoginRoute = LoginImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedRoute = AuthenticatedImport.update({
  id: '/_authenticated',
  getParentRoute: () => rootRoute,
} as any)

const AuthenticatedIndexRoute = AuthenticatedIndexImport.update({
  path: '/',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedQueryIndexRoute = AuthenticatedQueryIndexImport.update({
  path: '/query/',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedDataIndexRoute = AuthenticatedDataIndexImport.update({
  path: '/data/',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedCapletsIndexRoute = AuthenticatedCapletsIndexImport.update({
  path: '/caplets/',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedAccountIndexRoute = AuthenticatedAccountIndexImport.update({
  path: '/account/',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedModelsModelRoute = AuthenticatedModelsModelImport.update({
  path: '/models/$model',
  getParentRoute: () => AuthenticatedRoute,
} as any)

const AuthenticatedDataDatabaseIdRoute =
  AuthenticatedDataDatabaseIdImport.update({
    path: '/data/$databaseId',
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedCapletsCapletIdRoute =
  AuthenticatedCapletsCapletIdImport.update({
    path: '/caplets/$capletId',
    getParentRoute: () => AuthenticatedRoute,
  } as any)

const AuthenticatedDataDatabaseIdTableNameRoute =
  AuthenticatedDataDatabaseIdTableNameImport.update({
    path: '/$tableName',
    getParentRoute: () => AuthenticatedDataDatabaseIdRoute,
  } as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_authenticated': {
      id: '/_authenticated'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AuthenticatedImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginImport
      parentRoute: typeof rootRoute
    }
    '/loginOld': {
      id: '/loginOld'
      path: '/loginOld'
      fullPath: '/loginOld'
      preLoaderRoute: typeof LoginOldImport
      parentRoute: typeof rootRoute
    }
    '/_authenticated/': {
      id: '/_authenticated/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof AuthenticatedIndexImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/caplets/$capletId': {
      id: '/_authenticated/caplets/$capletId'
      path: '/caplets/$capletId'
      fullPath: '/caplets/$capletId'
      preLoaderRoute: typeof AuthenticatedCapletsCapletIdImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/data/$databaseId': {
      id: '/_authenticated/data/$databaseId'
      path: '/data/$databaseId'
      fullPath: '/data/$databaseId'
      preLoaderRoute: typeof AuthenticatedDataDatabaseIdImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/models/$model': {
      id: '/_authenticated/models/$model'
      path: '/models/$model'
      fullPath: '/models/$model'
      preLoaderRoute: typeof AuthenticatedModelsModelImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/account/': {
      id: '/_authenticated/account/'
      path: '/account'
      fullPath: '/account'
      preLoaderRoute: typeof AuthenticatedAccountIndexImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/caplets/': {
      id: '/_authenticated/caplets/'
      path: '/caplets'
      fullPath: '/caplets'
      preLoaderRoute: typeof AuthenticatedCapletsIndexImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/data/': {
      id: '/_authenticated/data/'
      path: '/data'
      fullPath: '/data'
      preLoaderRoute: typeof AuthenticatedDataIndexImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/query/': {
      id: '/_authenticated/query/'
      path: '/query'
      fullPath: '/query'
      preLoaderRoute: typeof AuthenticatedQueryIndexImport
      parentRoute: typeof AuthenticatedImport
    }
    '/_authenticated/data/$databaseId/$tableName': {
      id: '/_authenticated/data/$databaseId/$tableName'
      path: '/$tableName'
      fullPath: '/data/$databaseId/$tableName'
      preLoaderRoute: typeof AuthenticatedDataDatabaseIdTableNameImport
      parentRoute: typeof AuthenticatedDataDatabaseIdImport
    }
  }
}

// Create and export the route tree

interface AuthenticatedDataDatabaseIdRouteChildren {
  AuthenticatedDataDatabaseIdTableNameRoute: typeof AuthenticatedDataDatabaseIdTableNameRoute
}

const AuthenticatedDataDatabaseIdRouteChildren: AuthenticatedDataDatabaseIdRouteChildren =
  {
    AuthenticatedDataDatabaseIdTableNameRoute:
      AuthenticatedDataDatabaseIdTableNameRoute,
  }

const AuthenticatedDataDatabaseIdRouteWithChildren =
  AuthenticatedDataDatabaseIdRoute._addFileChildren(
    AuthenticatedDataDatabaseIdRouteChildren,
  )

interface AuthenticatedRouteChildren {
  AuthenticatedIndexRoute: typeof AuthenticatedIndexRoute
  AuthenticatedCapletsCapletIdRoute: typeof AuthenticatedCapletsCapletIdRoute
  AuthenticatedDataDatabaseIdRoute: typeof AuthenticatedDataDatabaseIdRouteWithChildren
  AuthenticatedModelsModelRoute: typeof AuthenticatedModelsModelRoute
  AuthenticatedAccountIndexRoute: typeof AuthenticatedAccountIndexRoute
  AuthenticatedCapletsIndexRoute: typeof AuthenticatedCapletsIndexRoute
  AuthenticatedDataIndexRoute: typeof AuthenticatedDataIndexRoute
  AuthenticatedQueryIndexRoute: typeof AuthenticatedQueryIndexRoute
}

const AuthenticatedRouteChildren: AuthenticatedRouteChildren = {
  AuthenticatedIndexRoute: AuthenticatedIndexRoute,
  AuthenticatedCapletsCapletIdRoute: AuthenticatedCapletsCapletIdRoute,
  AuthenticatedDataDatabaseIdRoute:
    AuthenticatedDataDatabaseIdRouteWithChildren,
  AuthenticatedModelsModelRoute: AuthenticatedModelsModelRoute,
  AuthenticatedAccountIndexRoute: AuthenticatedAccountIndexRoute,
  AuthenticatedCapletsIndexRoute: AuthenticatedCapletsIndexRoute,
  AuthenticatedDataIndexRoute: AuthenticatedDataIndexRoute,
  AuthenticatedQueryIndexRoute: AuthenticatedQueryIndexRoute,
}

const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren,
)

export interface FileRoutesByFullPath {
  '': typeof AuthenticatedRouteWithChildren
  '/login': typeof LoginRoute
  '/loginOld': typeof LoginOldRoute
  '/': typeof AuthenticatedIndexRoute
  '/caplets/$capletId': typeof AuthenticatedCapletsCapletIdRoute
  '/data/$databaseId': typeof AuthenticatedDataDatabaseIdRouteWithChildren
  '/models/$model': typeof AuthenticatedModelsModelRoute
  '/account': typeof AuthenticatedAccountIndexRoute
  '/caplets': typeof AuthenticatedCapletsIndexRoute
  '/data': typeof AuthenticatedDataIndexRoute
  '/query': typeof AuthenticatedQueryIndexRoute
  '/data/$databaseId/$tableName': typeof AuthenticatedDataDatabaseIdTableNameRoute
}

export interface FileRoutesByTo {
  '/login': typeof LoginRoute
  '/loginOld': typeof LoginOldRoute
  '/': typeof AuthenticatedIndexRoute
  '/caplets/$capletId': typeof AuthenticatedCapletsCapletIdRoute
  '/data/$databaseId': typeof AuthenticatedDataDatabaseIdRouteWithChildren
  '/models/$model': typeof AuthenticatedModelsModelRoute
  '/account': typeof AuthenticatedAccountIndexRoute
  '/caplets': typeof AuthenticatedCapletsIndexRoute
  '/data': typeof AuthenticatedDataIndexRoute
  '/query': typeof AuthenticatedQueryIndexRoute
  '/data/$databaseId/$tableName': typeof AuthenticatedDataDatabaseIdTableNameRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/_authenticated': typeof AuthenticatedRouteWithChildren
  '/login': typeof LoginRoute
  '/loginOld': typeof LoginOldRoute
  '/_authenticated/': typeof AuthenticatedIndexRoute
  '/_authenticated/caplets/$capletId': typeof AuthenticatedCapletsCapletIdRoute
  '/_authenticated/data/$databaseId': typeof AuthenticatedDataDatabaseIdRouteWithChildren
  '/_authenticated/models/$model': typeof AuthenticatedModelsModelRoute
  '/_authenticated/account/': typeof AuthenticatedAccountIndexRoute
  '/_authenticated/caplets/': typeof AuthenticatedCapletsIndexRoute
  '/_authenticated/data/': typeof AuthenticatedDataIndexRoute
  '/_authenticated/query/': typeof AuthenticatedQueryIndexRoute
  '/_authenticated/data/$databaseId/$tableName': typeof AuthenticatedDataDatabaseIdTableNameRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | ''
    | '/login'
    | '/loginOld'
    | '/'
    | '/caplets/$capletId'
    | '/data/$databaseId'
    | '/models/$model'
    | '/account'
    | '/caplets'
    | '/data'
    | '/query'
    | '/data/$databaseId/$tableName'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/login'
    | '/loginOld'
    | '/'
    | '/caplets/$capletId'
    | '/data/$databaseId'
    | '/models/$model'
    | '/account'
    | '/caplets'
    | '/data'
    | '/query'
    | '/data/$databaseId/$tableName'
  id:
    | '__root__'
    | '/_authenticated'
    | '/login'
    | '/loginOld'
    | '/_authenticated/'
    | '/_authenticated/caplets/$capletId'
    | '/_authenticated/data/$databaseId'
    | '/_authenticated/models/$model'
    | '/_authenticated/account/'
    | '/_authenticated/caplets/'
    | '/_authenticated/data/'
    | '/_authenticated/query/'
    | '/_authenticated/data/$databaseId/$tableName'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  AuthenticatedRoute: typeof AuthenticatedRouteWithChildren
  LoginRoute: typeof LoginRoute
  LoginOldRoute: typeof LoginOldRoute
}

const rootRouteChildren: RootRouteChildren = {
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  LoginRoute: LoginRoute,
  LoginOldRoute: LoginOldRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/_authenticated",
        "/login",
        "/loginOld"
      ]
    },
    "/_authenticated": {
      "filePath": "_authenticated.tsx",
      "children": [
        "/_authenticated/",
        "/_authenticated/caplets/$capletId",
        "/_authenticated/data/$databaseId",
        "/_authenticated/models/$model",
        "/_authenticated/account/",
        "/_authenticated/caplets/",
        "/_authenticated/data/",
        "/_authenticated/query/"
      ]
    },
    "/login": {
      "filePath": "login.tsx"
    },
    "/loginOld": {
      "filePath": "loginOld.tsx"
    },
    "/_authenticated/": {
      "filePath": "_authenticated/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/caplets/$capletId": {
      "filePath": "_authenticated/caplets/$capletId.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/data/$databaseId": {
      "filePath": "_authenticated/data/$databaseId.tsx",
      "parent": "/_authenticated",
      "children": [
        "/_authenticated/data/$databaseId/$tableName"
      ]
    },
    "/_authenticated/models/$model": {
      "filePath": "_authenticated/models/$model.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/account/": {
      "filePath": "_authenticated/account/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/caplets/": {
      "filePath": "_authenticated/caplets/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/data/": {
      "filePath": "_authenticated/data/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/query/": {
      "filePath": "_authenticated/query/index.tsx",
      "parent": "/_authenticated"
    },
    "/_authenticated/data/$databaseId/$tableName": {
      "filePath": "_authenticated/data/$databaseId.$tableName.tsx",
      "parent": "/_authenticated/data/$databaseId"
    }
  }
}
ROUTE_MANIFEST_END */
