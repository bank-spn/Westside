CREATE TABLE `parcels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`trackingNumber` varchar(255) NOT NULL,
	`parcelName` varchar(255),
	`destination` varchar(255),
	`dateSent` timestamp,
	`note` text,
	`status` varchar(50),
	`statusDescription` text,
	`statusDate` timestamp,
	`location` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `parcels_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectName` varchar(255) NOT NULL,
	`description` text,
	`status` enum('planning','in_progress','completed','on_hold') DEFAULT 'planning',
	`priority` enum('low','medium','high','urgent') DEFAULT 'medium',
	`startDate` timestamp,
	`dueDate` timestamp,
	`completedDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shipments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`shipmentName` varchar(255) NOT NULL,
	`origin` varchar(255),
	`destination` varchar(255),
	`weight` varchar(50),
	`dimensions` varchar(100),
	`shippingMethod` varchar(100),
	`estimatedCost` varchar(50),
	`notes` text,
	`status` varchar(50) DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shipments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `weeklyPlans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`weekStartDate` timestamp NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`tasks` text,
	`completed` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `weeklyPlans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `parcels` ADD CONSTRAINT `parcels_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `shipments` ADD CONSTRAINT `shipments_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `weeklyPlans` ADD CONSTRAINT `weeklyPlans_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;