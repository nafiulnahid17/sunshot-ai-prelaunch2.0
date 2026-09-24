CREATE TABLE `waitlist` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`source` text DEFAULT 'website' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `waitlist_email_unique` ON `waitlist` (`email`);