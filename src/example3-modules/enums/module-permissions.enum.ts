export enum ModulePermission {
  // User Module
  USERS_LIST = 'users:list',
  USERS_READ = 'users:read',
  USERS_CREATE = 'users:create',
  USERS_UPDATE = 'users:update',
  USERS_DELETE = 'users:delete',

  // Post Module
  POSTS_LIST = 'posts:list',
  POSTS_READ = 'posts:read',
  POSTS_CREATE = 'posts:create',
  POSTS_UPDATE = 'posts:update',
  POSTS_DELETE = 'posts:delete',
  POSTS_PUBLISH = 'posts:publish',

  // Product Module
  PRODUCTS_LIST = 'products:list',
  PRODUCTS_READ = 'products:read',
  PRODUCTS_CREATE = 'products:create',
  PRODUCTS_UPDATE = 'products:update',
  PRODUCTS_DELETE = 'products:delete',
  PRODUCTS_MANAGE_INVENTORY = 'products:manage_inventory',

  // Order Module
  ORDERS_LIST = 'orders:list',
  ORDERS_READ = 'orders:read',
  ORDERS_CREATE = 'orders:create',
  ORDERS_UPDATE = 'orders:update',
  ORDERS_DELETE = 'orders:delete',
  ORDERS_CANCEL = 'orders:cancel',
  ORDERS_REFUND = 'orders:refund',
}
