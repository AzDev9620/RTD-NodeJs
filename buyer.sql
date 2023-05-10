--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.17
-- Dumped by pg_dump version 9.5.17

-- Started on 2020-03-21 04:13:03 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 185 (class 1259 OID 100424)
-- Name: buyer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.buyer (
    id integer NOT NULL,
    personaldata jsonb,
    wishes jsonb
);


ALTER TABLE public.buyer OWNER TO postgres;

--
-- TOC entry 182 (class 1259 OID 100414)
-- Name: buyer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.buyer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.buyer_id_seq OWNER TO postgres;

--
-- TOC entry 2173 (class 0 OID 0)
-- Dependencies: 182
-- Name: buyer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.buyer_id_seq OWNED BY public.buyer.id;


--
-- TOC entry 2051 (class 2604 OID 100428)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.buyer ALTER COLUMN id SET DEFAULT nextval('public.buyer_id_seq'::regclass);


--
-- TOC entry 2167 (class 0 OID 100424)
-- Dependencies: 185
-- Data for Name: buyer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.buyer (id, personaldata, wishes) FROM stdin;
3	{"maininfo": {"customertel": ["+998983139848"], "customerdata": "Азиз ака"}}	\N
4	{"maininfo": {"customertel": ["+998935717474"], "customerdata": "Нилуфаропа"}}	\N
6	{"maininfo": {"customertel": [null], "customerdata": "Тест"}}	\N
16	{"maininfo": {"customerdata": "Юнусака"}}	\N
10	{"maininfo": {"customerdata": "Sarvaraka"}}	\N
17	{"maininfo": {"customertel": ["901857288", "712247836"], "customerdata": "Zuhra Karimovna"}}	\N
11	{"maininfo": {"customertel": ["712227594"], "customerdata": "Дилором опа 2 /4/4"}}	\N
19	{"maininfo": {"customertel": ["+998909901010"], "customerdata": "Анвар ака", "customerdatafull": [{"role": "частное лицо"}]}}	\N
12	{"maininfo": {"customertel": ["+998901893888"], "customerdata": "Олим ака"}}	\N
21	{"maininfo": {"customertel": ["973647777"], "customerdata": "Фаррух"}}	\N
2	{"maininfo": {"customertel": ["712235158", "909098815"], "customerdata": "Алфия"}}	\N
22	{"maininfo": {"customertel": ["998071599"], "customerdata": "Дилшод.", "customerdatafull": [{"role": "частное лицо"}]}}	\N
20	{"maininfo": {"customertel": ["901518707", "997200744"], "customerdata": "Темур", "customerdatafull": [{"role": "частное лицо"}]}}	\N
23	{"maininfo": {"customerdata": "Mirjalol"}}	\N
9	{"maininfo": {"customertel": ["909447107"], "customerdata": "Valide"}}	\N
5	{"maininfo": {"customerdata": "Dilmurod"}}	\N
18	{"maininfo": {"customertel": ["12345"], "customerdata": "87897"}}	\N
13	{"maininfo": {"customertel": ["+998942131111"], "customerdata": "Шахзода"}}	\N
14	{"maininfo": {"customertel": ["+998998605160"], "customerdata": "Мавлюда"}}	\N
15	{"maininfo": {"customertel": ["901850604"], "customerdata": "Шаблон rtd2Садриддинака", "customerdatafull": [{"role": "частное лицо"}]}}	\N
1	{"maininfo": {"customerdata": "RTD-ARENDA"}}	\N
7	{"maininfo": {"customerdata": "РусКуплюЮ.а2галарейкаКаттасидан"}}	\N
8	{"maininfo": {"customertel": ["901850604"], "customerdata": "ШаблонРТД"}}	\N
\.


--
-- TOC entry 2174 (class 0 OID 0)
-- Dependencies: 182
-- Name: buyer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.buyer_id_seq', 23, true);


-- Completed on 2020-03-21 04:13:06 UTC

--
-- PostgreSQL database dump complete
--

