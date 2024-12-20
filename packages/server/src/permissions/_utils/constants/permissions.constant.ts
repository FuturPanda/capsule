enum DataAccessLevels {
  NONE = 'access:none',
  READ_ONLY = 'access:read_only',
  READ_WRITE = 'access:read_write',
  FULL_ACCESS = 'access:full',
}

enum BasicPermissions {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list', // View list/summary
  EXPORT = 'export', // Export data
  IMPORT = 'import', // Import data
}

interface Permission {
  resource: string;
  action: string;
  scope?: string;
}

// Example: 'posts:write:own' or 'posts:write:all'
const hierarchicalPermission: Permission = {
  resource: 'posts',
  action: 'write',
  scope: 'own',
};
