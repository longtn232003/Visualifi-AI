export const PATH_ROUTES = {
  // public routes
  unauthorized: '/unauthorized',
  login: '/login',

  home: '/',

  createInfographic: '/create-infographic',
  samples: '/samples',
  pricing: '/pricing',
  blog: '/blog',
  resetPassword: '/reset-password/:token',

  // private routes
  profile: '/profile',

  templateStore: '/template-store',
  authCallback: '/auth/callback',

  editInfographic: '/edit-infographic/:id',
  payment: '/payment',
  paymentConfirm: '/admin/payment-confirmation'
}
