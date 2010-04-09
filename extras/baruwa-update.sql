BEGIN;

CREATE TABLE IF NOT EXISTS `archive` (
  `timestamp` timestamp NOT NULL default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP,
  `id` mediumtext,
  `size` bigint(20) default '0',
  `from_address` mediumtext,
  `from_domain` mediumtext,
  `to_address` mediumtext,
  `to_domain` mediumtext,
  `subject` mediumtext,
  `clientip` mediumtext,
  `archive` mediumtext,
  `isspam` tinyint(1) default '0',
  `ishighspam` tinyint(1) default '0',
  `issaspam` tinyint(1) default '0',
  `isrblspam` tinyint(1) default '0',
  `isfp` tinyint(1) default '0',
  `isfn` tinyint(1) default '0',
  `spamwhitelisted` tinyint(1) default '0',
  `spamblacklisted` tinyint(1) default '0',
  `sascore` decimal(7,2) default '0.00',
  `spamreport` mediumtext,
  `virusinfected` tinyint(1) default '0',
  `nameinfected` tinyint(1) default '0',
  `otherinfected` tinyint(1) default '0',
  `report` mediumtext,
  `ismcp` tinyint(1) default '0',
  `ishighmcp` tinyint(1) default '0',
  `issamcp` tinyint(1) default '0',
  `mcpwhitelisted` tinyint(1) default '0',
  `mcpblacklisted` tinyint(1) default '0',
  `mcpsascore` decimal(7,2) default '0.00',
  `mcpreport` mediumtext,
  `hostname` mediumtext,
  `date` date default NULL,
  `time` time default NULL,
  `headers` mediumtext,
  `quarantined` tinyint(1) default '0',
  KEY `archive_datetime_idx` (`date`,`time`),
  KEY `archive_id_idx` (`id`(20)),
  KEY `archive_clientip_idx` (`clientip`(20)),
  KEY `archive_from_idx` (`from_address`(200)),
  KEY `archive_to_idx` (`to_address`(200)),
  KEY `archive_host` (`hostname`(30)),
  KEY `from_domain_idx` (`from_domain`(50)),
  KEY `to_domain_idx` (`to_domain`(50)),
  KEY `archive_quarantined` (`quarantined`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
SET character_set_client = @saved_cs_client;

CREATE TABLE IF NOT EXISTS `auth_permission` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `name` varchar(50) NOT NULL,
    `content_type_id` integer NOT NULL,
    `codename` varchar(100) NOT NULL,
    UNIQUE (`content_type_id`, `codename`)
)
;
ALTER TABLE `auth_permission` ADD CONSTRAINT `content_type_id_refs_id_728de91f` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`);
CREATE TABLE IF NOT EXISTS `auth_group` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `name` varchar(80) NOT NULL UNIQUE
)
;
CREATE TABLE IF NOT EXISTS `auth_user` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `username` varchar(30) NOT NULL UNIQUE,
    `first_name` varchar(30) NOT NULL,
    `last_name` varchar(30) NOT NULL,
    `email` varchar(75) NOT NULL,
    `password` varchar(128) NOT NULL,
    `is_staff` bool NOT NULL,
    `is_active` bool NOT NULL,
    `is_superuser` bool NOT NULL,
    `last_login` datetime NOT NULL,
    `date_joined` datetime NOT NULL
)
;
CREATE TABLE IF NOT EXISTS `auth_message` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `user_id` integer NOT NULL,
    `message` longtext NOT NULL
)
;
ALTER TABLE `auth_message` ADD CONSTRAINT `user_id_refs_id_9af0b65a` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);
CREATE TABLE IF NOT EXISTS `auth_group_permissions` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `group_id` integer NOT NULL,
    `permission_id` integer NOT NULL,
    UNIQUE (`group_id`, `permission_id`)
)
;
ALTER TABLE `auth_group_permissions` ADD CONSTRAINT `group_id_refs_id_3cea63fe` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);
ALTER TABLE `auth_group_permissions` ADD CONSTRAINT `permission_id_refs_id_a7792de1` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`);
CREATE TABLE IF NOT EXISTS `auth_user_groups` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `user_id` integer NOT NULL,
    `group_id` integer NOT NULL,
    UNIQUE (`user_id`, `group_id`)
)
;
ALTER TABLE `auth_user_groups` ADD CONSTRAINT `user_id_refs_id_831107f1` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);
ALTER TABLE `auth_user_groups` ADD CONSTRAINT `group_id_refs_id_f0ee9890` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`);
CREATE TABLE IF NOT EXISTS `auth_user_user_permissions` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `user_id` integer NOT NULL,
    `permission_id` integer NOT NULL,
    UNIQUE (`user_id`, `permission_id`)
)
;
ALTER TABLE `auth_user_user_permissions` ADD CONSTRAINT `user_id_refs_id_f2045483` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`);
ALTER TABLE `auth_user_user_permissions` ADD CONSTRAINT `permission_id_refs_id_67e79cb` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`);
CREATE INDEX `auth_permission_content_type_id` ON `auth_permission` (`content_type_id`);
CREATE INDEX `auth_message_user_id` ON `auth_message` (`user_id`);
CREATE TABLE IF NOT EXISTS `django_content_type` (
    `id` integer AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `name` varchar(100) NOT NULL,
    `app_label` varchar(100) NOT NULL,
    `model` varchar(100) NOT NULL,
    UNIQUE (`app_label`, `model`)
)
;
CREATE TABLE IF NOT EXISTS `django_session` (
    `session_KEY` varchar(40) NOT NULL PRIMARY KEY,
    `session_data` longtext NOT NULL,
    `expire_date` datetime NOT NULL
);

ALTER TABLE saved_filters ADD column id integer NOT NULL auto_increment PRIMARY KEY first;
ALTER TABLE user_filters ADD column id integer NOT NULL auto_increment PRIMARY KEY first;

COMMIT;
