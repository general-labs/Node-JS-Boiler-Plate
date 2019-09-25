--
-- Name: users; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

SET timezone = 'America/New_York';

DROP TABLE IF EXISTS users;
DROP SEQUENCE IF EXISTS users_id_seq;
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  uuid integer NOT NULL,
  user_name character varying(40) NOT NULL,
  password character varying(255) NOT NULL,
  full_name character varying(30) NOT NULL,
  title character varying(30) NOT NULL,
  phone character varying(60) NOT NULL,
  email character varying(65) NOT NULL,
  last_access  TIMESTAMPTZ,
  timezone character varying(65) NOT NULL,
  picture character varying(255) NOT NULL,
  status smallint NOT NULL  
);

--
-- Name: contents; Type: TABLE; Schema: public; Owner: -; Tablespace: 
--

DROP TABLE IF EXISTS contents;
DROP SEQUENCE IF EXISTS contents_id_seq;
CREATE TABLE contents (
  id serial NOT NULL PRIMARY KEY,
  title character varying(255) NOT NULL,
  device_name character varying(45) NOT NULL,
  action character varying(45) NOT NULL,
  data TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
