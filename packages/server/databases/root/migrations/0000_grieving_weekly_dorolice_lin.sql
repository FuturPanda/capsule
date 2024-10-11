CREATE TABLE IF NOT EXISTS `user` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` TEXT NOT NULL UNIQUE,
	`password` TEXT,
	`api_key` TEXT,
	`siret` TEXT,
	`schema` TEXT,
	`type` TEXT NOT NULL,
	CHECK (type IN ('OWNER','USER','CLIENT'))
);

CREATE TABLE IF NOT EXISTS `user_resource_permission` (
	`client_id` INTEGER NOT NULL,
	`permission_id` INTEGER NOT NULL,
	`resource_id` INTEGER NOT NULL,
	PRIMARY KEY (  `client_id`, `permission_id`, `resource_id` )
);

CREATE TABLE IF NOT EXISTS `permission` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` TEXT NOT NULL,
	CHECK (name IN ('ONE'))
);

CREATE TABLE IF NOT EXISTS `database` (
	`resource_id` INTEGER PRIMARY KEY NOT NULL,
	`name` TEXT NOT NULL,
	`schema` TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS `kv` (
	`resource_id` INTEGER PRIMARY KEY NOT NULL,
	`key` TEXT NOT NULL,
	`value` TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS `document` (
	`resource_id` INTEGER PRIMARY KEY NOT NULL,
	`value` TEXT NOT NULL
);
