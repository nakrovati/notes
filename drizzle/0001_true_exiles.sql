DROP INDEX IF EXISTS `unique_email`;--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `notes` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);