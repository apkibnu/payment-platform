-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION pg_database_owner;
-- public.banners definition

-- Drop table

-- DROP TABLE public.banners;

CREATE TABLE public.banners (
	id uuid NOT NULL,
	banner_name varchar NOT NULL,
	banner_image varchar NULL,
	description varchar NULL,
	created_at timestamptz NULL,
	updated_at timestamptz NULL,
	CONSTRAINT banners_pk PRIMARY KEY (id)
);


-- public.services definition

-- Drop table

-- DROP TABLE public.services;

CREATE TABLE public.services (
	id uuid NOT NULL,
	service_code varchar NULL,
	service_name varchar NULL,
	service_icon varchar NULL,
	service_tariff int4 NULL,
	created_at timestamptz NULL,
	updated_at timestamptz NULL,
	CONSTRAINT services_pk PRIMARY KEY (id)
);
CREATE UNIQUE INDEX services_service_code_idx ON public.services USING btree (service_code);


-- public.transaction_types definition

-- Drop table

-- DROP TABLE public.transaction_types;

CREATE TABLE public.transaction_types (
	id uuid NOT NULL,
	"name" varchar NULL,
	created_at timestamptz NULL,
	updated_at timestamptz NULL,
	CONSTRAINT transaction_types_pk PRIMARY KEY (id)
);


-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id uuid NOT NULL,
	email varchar NOT NULL,
	first_name varchar NULL,
	last_name varchar NULL,
	profile_image varchar NULL,
	created_at timestamptz NULL DEFAULT now(),
	updated_at timestamptz NULL DEFAULT now(),
	"password" varchar NULL,
	CONSTRAINT users_pk PRIMARY KEY (id)
);
CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


-- public.accounts definition

-- Drop table

-- DROP TABLE public.accounts;

CREATE TABLE public.accounts (
	id uuid NOT NULL,
	user_id uuid NOT NULL,
	balance int4 NOT NULL DEFAULT 0,
	created_at timestamptz NULL,
	updated_at timestamptz NULL,
	CONSTRAINT accounts_pk PRIMARY KEY (id),
	CONSTRAINT accounts_fk FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE UNIQUE INDEX accounts_user_id_idx ON public.accounts USING btree (user_id);


-- public.transactions definition

-- Drop table

-- DROP TABLE public.transactions;

CREATE TABLE public.transactions (
	id uuid NOT NULL,
	invoice_number varchar NOT NULL,
	service_id uuid NULL,
	transaction_type_id uuid NOT NULL,
	account_id uuid NOT NULL,
	amount int4 NOT NULL,
	created_at timestamptz NULL,
	updated_at timestamptz NULL,
	CONSTRAINT transactions_pk PRIMARY KEY (id),
	CONSTRAINT transactions_fk FOREIGN KEY (service_id) REFERENCES public.services(id),
	CONSTRAINT transactions_fk_1 FOREIGN KEY (transaction_type_id) REFERENCES public.transaction_types(id),
	CONSTRAINT transactions_fk_2 FOREIGN KEY (account_id) REFERENCES public.accounts(id)
);
CREATE UNIQUE INDEX transactions_invoice_number_idx ON public.transactions USING btree (invoice_number);