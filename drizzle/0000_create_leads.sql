CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`submission_id` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`full_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`company` text,
	`country` text NOT NULL,
	`market` text NOT NULL,
	`role` text NOT NULL,
	`industry` text NOT NULL,
	`project_type` text NOT NULL,
	`package_interest` text,
	`problem_description` text NOT NULL,
	`current_workaround` text NOT NULL,
	`intended_users` text NOT NULL,
	`user_discussions` text NOT NULL,
	`user_access` text NOT NULL,
	`problem_impact` text NOT NULL,
	`product_stage` text NOT NULL,
	`budget_range` text NOT NULL,
	`timeline` text NOT NULL,
	`decision_authority` text NOT NULL,
	`score` integer NOT NULL,
	`score_breakdown_json` text NOT NULL,
	`qualification_status` text NOT NULL,
	`lead_status` text DEFAULT 'new' NOT NULL,
	`landing_page` text,
	`referrer` text,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`utm_content` text,
	`utm_term` text,
	`fbclid` text,
	`first_touch_json` text NOT NULL,
	`last_touch_json` text NOT NULL,
	`contact_consent` integer NOT NULL,
	`marketing_consent` integer DEFAULT false NOT NULL,
	`advertising_consent` integer DEFAULT false NOT NULL,
	`advertising_consent_updated_at` text,
	`consent_policy_version` text,
	`retention_until` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `leads_submission_id_unique` ON `leads` (`submission_id`);
--> statement-breakpoint
CREATE INDEX `leads_created_at_idx` ON `leads` (`created_at`);
--> statement-breakpoint
CREATE INDEX `leads_qualification_status_idx` ON `leads` (`qualification_status`);
--> statement-breakpoint
CREATE INDEX `leads_retention_until_idx` ON `leads` (`retention_until`);
