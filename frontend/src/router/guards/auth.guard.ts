import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export const requireAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const token = localStorage.getItem('user-token')

  if (token) {
    next()
  } else {
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
  }
}
