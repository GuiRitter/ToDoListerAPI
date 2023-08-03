-- sudo -u postgres createdb to_do_lister

-- sudo -u postgres psql to_do_lister

CREATE EXTENSION "uuid-ossp";

-- psql to_do_lister

create table ´user´ (
	login text primary key,
	password text not null
);

create table list (
	id uuid default uuid_generate_v4() primary key,
	name text not null
);

create table status (
	name text primary key
);

create table entry (
	id uuid default uuid_generate_v4() primary key,
	list uuid references list(id) not null,
	status text references status(name) not null,
	external_id text null,
	url text null,
	creation_date text not null,
	external_date text null,
	content text null
);

-- DROP TRIGGER ignore_already_existing_external_id ON bet; DROP FUNCTION test_ignore_already_existing_external_id;
CREATE FUNCTION test_ignore_already_existing_external_id() RETURNS trigger AS $$
DECLARE
  existing_external_id TEXT;
BEGIN
  IF (NEW.external_id IS NULL) THEN
    RETURN NEW;
  END IF;
  SELECT external_id INTO existing_external_id FROM entry WHERE list = NEW.list AND external_id like NEW.external_id LIMIT 1;
  IF (existing_external_id IS NOT NULL) THEN
    RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER ignore_already_existing_external_id BEFORE INSERT ON entry
FOR EACH ROW EXECUTE PROCEDURE test_ignore_already_existing_external_id();

-- DROP TRIGGER ignore_already_existing_external_id ON bet; DROP FUNCTION test_ignore_already_existing_url;
CREATE FUNCTION test_ignore_already_existing_url() RETURNS trigger AS $$
DECLARE
  existing_url TEXT;
BEGIN
  IF (NEW.url IS NULL) THEN
    RETURN NEW;
  END IF;
  SELECT url INTO existing_url FROM entry WHERE list = NEW.list AND url like NEW.url LIMIT 1;
  IF (existing_url IS NOT NULL) THEN
    RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER ignore_already_existing_url BEFORE INSERT ON entry
FOR EACH ROW EXECUTE PROCEDURE test_ignore_already_existing_url();
