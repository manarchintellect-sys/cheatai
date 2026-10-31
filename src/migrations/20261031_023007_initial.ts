import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_articles_section" AS ENUM('news', 'articles', 'guides', 'business');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_section" AS ENUM('news', 'articles', 'guides', 'business');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_comparisons_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__comparisons_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_tools_tasks" AS ENUM('writing', 'qa', 'image-gen', 'video-gen', 'research', 'coding', 'workflow', 'docs');
  CREATE TYPE "public"."enum_tools_platforms" AS ENUM('web', 'ios', 'android', 'windows', 'macos', 'api', 'selfhosted', 'telegram');
  CREATE TYPE "public"."enum_tools_color" AS ENUM('yellow', 'red', 'blue', 'orange', 'black');
  CREATE TYPE "public"."enum_tools_category" AS ENUM('text', 'image', 'video', 'search', 'automation', 'code');
  CREATE TYPE "public"."enum_tools_pricing" AS ENUM('free', 'freemium', 'paid', 'opensource', 'unknown');
  CREATE TYPE "public"."enum_tools_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__tools_v_version_tasks" AS ENUM('writing', 'qa', 'image-gen', 'video-gen', 'research', 'coding', 'workflow', 'docs');
  CREATE TYPE "public"."enum__tools_v_version_platforms" AS ENUM('web', 'ios', 'android', 'windows', 'macos', 'api', 'selfhosted', 'telegram');
  CREATE TYPE "public"."enum__tools_v_version_color" AS ENUM('yellow', 'red', 'blue', 'orange', 'black');
  CREATE TYPE "public"."enum__tools_v_version_category" AS ENUM('text', 'image', 'video', 'search', 'automation', 'code');
  CREATE TYPE "public"."enum__tools_v_version_pricing" AS ENUM('free', 'freemium', 'paid', 'opensource', 'unknown');
  CREATE TYPE "public"."enum__tools_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_prompts_category" AS ENUM('texts', 'study', 'business', 'marketing', 'images', 'code');
  CREATE TYPE "public"."enum_prompts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__prompts_v_version_category" AS ENUM('texts', 'study', 'business', 'marketing', 'images', 'code');
  CREATE TYPE "public"."enum__prompts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pages_form" AS ENUM('none', 'contact', 'ads', 'lead');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_form" AS ENUM('none', 'contact', 'ads', 'lead');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_categories_color" AS ENUM('yellow', 'red', 'blue', 'orange', 'black');
  CREATE TYPE "public"."enum_categories_icon" AS ENUM('chat', 'spark', 'image', 'video', 'bolt', 'gear', 'brain', 'shield', 'search', 'code', 'book', 'rocket', 'news', 'chart', 'eye', 'star');
  CREATE TYPE "public"."enum_tags_icon" AS ENUM('chat', 'spark', 'image', 'video', 'bolt', 'gear', 'brain', 'shield', 'search', 'code', 'book', 'rocket', 'news', 'chart', 'eye', 'star');
  CREATE TYPE "public"."enum_tags_color" AS ENUM('yellow', 'red', 'blue', 'orange', 'black');
  CREATE TYPE "public"."enum_ad_slots_placement" AS ENUM('home', 'article-inline', 'article-sidebar', 'catalog');
  CREATE TYPE "public"."enum_ad_slots_kind" AS ENUM('house', 'external', 'lead');
  CREATE TYPE "public"."enum_messages_topic" AS ENUM('contact', 'ads', 'lead');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'author');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TABLE "articles_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "articles_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"cover_id" integer,
  	"content" jsonb,
  	"slug" varchar,
  	"section" "enum_articles_section" DEFAULT 'articles',
  	"category_id" integer,
  	"featured" boolean DEFAULT false,
  	"hot" boolean DEFAULT false,
  	"sponsored_enabled" boolean DEFAULT false,
  	"sponsored_advertiser" varchar,
  	"sponsored_erid" varchar,
  	"is_demo" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"reading_time" numeric,
  	"search_text" varchar,
  	"canonical" varchar,
  	"noindex" boolean DEFAULT false,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"articles_id" integer,
  	"tools_id" integer,
  	"tags_id" integer,
  	"authors_id" integer
  );
  
  CREATE TABLE "_articles_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v_version_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_cover_id" integer,
  	"version_content" jsonb,
  	"version_slug" varchar,
  	"version_section" "enum__articles_v_version_section" DEFAULT 'articles',
  	"version_category_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_hot" boolean DEFAULT false,
  	"version_sponsored_enabled" boolean DEFAULT false,
  	"version_sponsored_advertiser" varchar,
  	"version_sponsored_erid" varchar,
  	"version_is_demo" boolean DEFAULT false,
  	"version_published_at" timestamp(3) with time zone,
  	"version_reading_time" numeric,
  	"version_search_text" varchar,
  	"version_canonical" varchar,
  	"version_noindex" boolean DEFAULT false,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_articles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"articles_id" integer,
  	"tools_id" integer,
  	"tags_id" integer,
  	"authors_id" integer
  );
  
  CREATE TABLE "comparisons_criteria" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"criterion" varchar,
  	"a" varchar,
  	"b" varchar
  );
  
  CREATE TABLE "comparisons_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "comparisons_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "comparisons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"tool_a_id" integer,
  	"tool_b_id" integer,
  	"cover_id" integer,
  	"content" jsonb,
  	"verdict" varchar,
  	"slug" varchar,
  	"is_demo" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"reading_time" numeric,
  	"search_text" varchar,
  	"canonical" varchar,
  	"noindex" boolean DEFAULT false,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_comparisons_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_comparisons_v_version_criteria" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"criterion" varchar,
  	"a" varchar,
  	"b" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_comparisons_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_comparisons_v_version_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_comparisons_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_tool_a_id" integer,
  	"version_tool_b_id" integer,
  	"version_cover_id" integer,
  	"version_content" jsonb,
  	"version_verdict" varchar,
  	"version_slug" varchar,
  	"version_is_demo" boolean DEFAULT false,
  	"version_published_at" timestamp(3) with time zone,
  	"version_reading_time" numeric,
  	"version_search_text" varchar,
  	"version_canonical" varchar,
  	"version_noindex" boolean DEFAULT false,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__comparisons_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "tools_use_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "tools_limitations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "tools_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "tools_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "tools_tasks" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_tools_tasks",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tools_platforms" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_tools_platforms",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "tools" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"developer" varchar,
  	"website" varchar,
  	"logo_id" integer,
  	"monogram" varchar,
  	"color" "enum_tools_color" DEFAULT 'yellow',
  	"content" jsonb,
  	"slug" varchar,
  	"category" "enum_tools_category",
  	"pricing" "enum_tools_pricing" DEFAULT 'unknown',
  	"partner_url" varchar,
  	"partner_promoted" boolean,
  	"partner_advertiser" varchar,
  	"partner_erid" varchar,
  	"is_demo" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"reading_time" numeric,
  	"search_text" varchar,
  	"canonical" varchar,
  	"noindex" boolean DEFAULT false,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_tools_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "tools_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "_tools_v_version_use_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tools_v_version_limitations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tools_v_version_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tools_v_version_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_tools_v_version_tasks" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__tools_v_version_tasks",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_tools_v_version_platforms" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__tools_v_version_platforms",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_tools_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_developer" varchar,
  	"version_website" varchar,
  	"version_logo_id" integer,
  	"version_monogram" varchar,
  	"version_color" "enum__tools_v_version_color" DEFAULT 'yellow',
  	"version_content" jsonb,
  	"version_slug" varchar,
  	"version_category" "enum__tools_v_version_category",
  	"version_pricing" "enum__tools_v_version_pricing" DEFAULT 'unknown',
  	"version_partner_url" varchar,
  	"version_partner_promoted" boolean,
  	"version_partner_advertiser" varchar,
  	"version_partner_erid" varchar,
  	"version_is_demo" boolean DEFAULT false,
  	"version_published_at" timestamp(3) with time zone,
  	"version_reading_time" numeric,
  	"version_search_text" varchar,
  	"version_canonical" varchar,
  	"version_noindex" boolean DEFAULT false,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__tools_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_tools_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "prompts_variables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"hint" varchar
  );
  
  CREATE TABLE "prompts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"prompt" varchar,
  	"content" jsonb,
  	"slug" varchar,
  	"category" "enum_prompts_category",
  	"is_demo" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"reading_time" numeric,
  	"search_text" varchar,
  	"canonical" varchar,
  	"noindex" boolean DEFAULT false,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_prompts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "prompts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tools_id" integer
  );
  
  CREATE TABLE "_prompts_v_version_variables" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"hint" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_prompts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_prompt" varchar,
  	"version_content" jsonb,
  	"version_slug" varchar,
  	"version_category" "enum__prompts_v_version_category",
  	"version_is_demo" boolean DEFAULT false,
  	"version_published_at" timestamp(3) with time zone,
  	"version_reading_time" numeric,
  	"version_search_text" varchar,
  	"version_canonical" varchar,
  	"version_noindex" boolean DEFAULT false,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__prompts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_prompts_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tools_id" integer
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"slug" varchar,
  	"form" "enum_pages_form" DEFAULT 'none',
  	"is_demo" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"reading_time" numeric,
  	"search_text" varchar,
  	"canonical" varchar,
  	"noindex" boolean DEFAULT false,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_slug" varchar,
  	"version_form" "enum__pages_v_version_form" DEFAULT 'none',
  	"version_is_demo" boolean DEFAULT false,
  	"version_published_at" timestamp(3) with time zone,
  	"version_reading_time" numeric,
  	"version_search_text" varchar,
  	"version_canonical" varchar,
  	"version_noindex" boolean DEFAULT false,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"credit" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"description" varchar,
  	"color" "enum_categories_color" DEFAULT 'yellow',
  	"icon" "enum_categories_icon" DEFAULT 'spark',
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"description" varchar,
  	"icon" "enum_tags_icon" DEFAULT 'spark',
  	"color" "enum_tags_color" DEFAULT 'yellow',
  	"is_hub" boolean DEFAULT false,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "authors_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "authors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"position" varchar,
  	"bio" varchar,
  	"avatar_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "ad_slots" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"placement" "enum_ad_slots_placement" NOT NULL,
  	"kind" "enum_ad_slots_kind" DEFAULT 'house' NOT NULL,
  	"active" boolean DEFAULT false,
  	"title" varchar NOT NULL,
  	"text" varchar,
  	"cta" varchar DEFAULT 'Подробнее',
  	"url" varchar NOT NULL,
  	"image_id" integer,
  	"advertiser" varchar,
  	"erid" varchar,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "subscribers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"source" varchar,
  	"consent" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "messages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"topic" "enum_messages_topic",
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"company" varchar,
  	"message" varchar NOT NULL,
  	"handled" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'author' NOT NULL,
  	"author_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"articles_id" integer,
  	"comparisons_id" integer,
  	"tools_id" integer,
  	"prompts_id" integer,
  	"pages_id" integer,
  	"media_id" integer,
  	"categories_id" integer,
  	"tags_id" integer,
  	"authors_id" integer,
  	"ad_slots_id" integer,
  	"subscribers_id" integer,
  	"messages_id" integer,
  	"redirects_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_title" varchar DEFAULT 'БУДУЩЕЕ УЖЕ ЗДЕСЬ. ЧИТАЙ!',
  	"hero_subtitle" varchar DEFAULT 'Нейросети, технологии и искусственный интеллект без сложных слов.',
  	"featured_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"articles_id" integer,
  	"comparisons_id" integer
  );
  
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'CHEATAI',
  	"slogan" varchar DEFAULT 'ЧИТАЙ. ПОНИМАЙ. СОЗДАВАЙ.',
  	"description" varchar DEFAULT 'Искусственный интеллект простым языком: нейросети, инструменты, промпты и гайды.',
  	"contact_email" varchar DEFAULT 'hello@cheatai.ru',
  	"ads_email" varchar DEFAULT 'ads@cheatai.ru',
  	"organization_name" varchar DEFAULT 'BONGO GROUP',
  	"organization_url" varchar,
  	"organization_legal_name" varchar,
  	"analytics_yandex_metrika_id" varchar,
  	"analytics_yandex_verification" varchar,
  	"analytics_google_verification" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "articles_faq" ADD CONSTRAINT "articles_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_sources" ADD CONSTRAINT "articles_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_tools_fk" FOREIGN KEY ("tools_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_version_faq" ADD CONSTRAINT "_articles_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_version_sources" ADD CONSTRAINT "_articles_v_version_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_tools_fk" FOREIGN KEY ("tools_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "comparisons_criteria" ADD CONSTRAINT "comparisons_criteria_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."comparisons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "comparisons_faq" ADD CONSTRAINT "comparisons_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."comparisons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "comparisons_sources" ADD CONSTRAINT "comparisons_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."comparisons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_tool_a_id_tools_id_fk" FOREIGN KEY ("tool_a_id") REFERENCES "public"."tools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_tool_b_id_tools_id_fk" FOREIGN KEY ("tool_b_id") REFERENCES "public"."tools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "comparisons" ADD CONSTRAINT "comparisons_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_comparisons_v_version_criteria" ADD CONSTRAINT "_comparisons_v_version_criteria_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_comparisons_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_comparisons_v_version_faq" ADD CONSTRAINT "_comparisons_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_comparisons_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_comparisons_v_version_sources" ADD CONSTRAINT "_comparisons_v_version_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_comparisons_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_comparisons_v" ADD CONSTRAINT "_comparisons_v_parent_id_comparisons_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comparisons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_comparisons_v" ADD CONSTRAINT "_comparisons_v_version_tool_a_id_tools_id_fk" FOREIGN KEY ("version_tool_a_id") REFERENCES "public"."tools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_comparisons_v" ADD CONSTRAINT "_comparisons_v_version_tool_b_id_tools_id_fk" FOREIGN KEY ("version_tool_b_id") REFERENCES "public"."tools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_comparisons_v" ADD CONSTRAINT "_comparisons_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_comparisons_v" ADD CONSTRAINT "_comparisons_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tools_use_cases" ADD CONSTRAINT "tools_use_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tools_limitations" ADD CONSTRAINT "tools_limitations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tools_faq" ADD CONSTRAINT "tools_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tools_sources" ADD CONSTRAINT "tools_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tools_tasks" ADD CONSTRAINT "tools_tasks_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tools_platforms" ADD CONSTRAINT "tools_platforms_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tools" ADD CONSTRAINT "tools_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tools" ADD CONSTRAINT "tools_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "tools_rels" ADD CONSTRAINT "tools_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "tools_rels" ADD CONSTRAINT "tools_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tools_v_version_use_cases" ADD CONSTRAINT "_tools_v_version_use_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tools_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tools_v_version_limitations" ADD CONSTRAINT "_tools_v_version_limitations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tools_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tools_v_version_faq" ADD CONSTRAINT "_tools_v_version_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tools_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tools_v_version_sources" ADD CONSTRAINT "_tools_v_version_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_tools_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tools_v_version_tasks" ADD CONSTRAINT "_tools_v_version_tasks_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_tools_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tools_v_version_platforms" ADD CONSTRAINT "_tools_v_version_platforms_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_tools_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tools_v" ADD CONSTRAINT "_tools_v_parent_id_tools_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."tools"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tools_v" ADD CONSTRAINT "_tools_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tools_v" ADD CONSTRAINT "_tools_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_tools_v_rels" ADD CONSTRAINT "_tools_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_tools_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_tools_v_rels" ADD CONSTRAINT "_tools_v_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prompts_variables" ADD CONSTRAINT "prompts_variables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."prompts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prompts" ADD CONSTRAINT "prompts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "prompts_rels" ADD CONSTRAINT "prompts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."prompts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "prompts_rels" ADD CONSTRAINT "prompts_rels_tools_fk" FOREIGN KEY ("tools_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prompts_v_version_variables" ADD CONSTRAINT "_prompts_v_version_variables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_prompts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prompts_v" ADD CONSTRAINT "_prompts_v_parent_id_prompts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."prompts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_prompts_v" ADD CONSTRAINT "_prompts_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_prompts_v_rels" ADD CONSTRAINT "_prompts_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_prompts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_prompts_v_rels" ADD CONSTRAINT "_prompts_v_rels_tools_fk" FOREIGN KEY ("tools_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "authors_links" ADD CONSTRAINT "authors_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "authors" ADD CONSTRAINT "authors_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ad_slots" ADD CONSTRAINT "ad_slots_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users" ADD CONSTRAINT "users_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_comparisons_fk" FOREIGN KEY ("comparisons_id") REFERENCES "public"."comparisons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tools_fk" FOREIGN KEY ("tools_id") REFERENCES "public"."tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_prompts_fk" FOREIGN KEY ("prompts_id") REFERENCES "public"."prompts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_authors_fk" FOREIGN KEY ("authors_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_ad_slots_fk" FOREIGN KEY ("ad_slots_id") REFERENCES "public"."ad_slots"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_subscribers_fk" FOREIGN KEY ("subscribers_id") REFERENCES "public"."subscribers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_messages_fk" FOREIGN KEY ("messages_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home" ADD CONSTRAINT "home_featured_id_articles_id_fk" FOREIGN KEY ("featured_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_rels" ADD CONSTRAINT "home_rels_comparisons_fk" FOREIGN KEY ("comparisons_id") REFERENCES "public"."comparisons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "articles_faq_order_idx" ON "articles_faq" USING btree ("_order");
  CREATE INDEX "articles_faq_parent_id_idx" ON "articles_faq" USING btree ("_parent_id");
  CREATE INDEX "articles_sources_order_idx" ON "articles_sources" USING btree ("_order");
  CREATE INDEX "articles_sources_parent_id_idx" ON "articles_sources" USING btree ("_parent_id");
  CREATE INDEX "articles_cover_idx" ON "articles" USING btree ("cover_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_category_idx" ON "articles" USING btree ("category_id");
  CREATE INDEX "articles_meta_meta_image_idx" ON "articles" USING btree ("meta_image_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_articles_id_idx" ON "articles_rels" USING btree ("articles_id");
  CREATE INDEX "articles_rels_tools_id_idx" ON "articles_rels" USING btree ("tools_id");
  CREATE INDEX "articles_rels_tags_id_idx" ON "articles_rels" USING btree ("tags_id");
  CREATE INDEX "articles_rels_authors_id_idx" ON "articles_rels" USING btree ("authors_id");
  CREATE INDEX "_articles_v_version_faq_order_idx" ON "_articles_v_version_faq" USING btree ("_order");
  CREATE INDEX "_articles_v_version_faq_parent_id_idx" ON "_articles_v_version_faq" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_version_sources_order_idx" ON "_articles_v_version_sources" USING btree ("_order");
  CREATE INDEX "_articles_v_version_sources_parent_id_idx" ON "_articles_v_version_sources" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_cover_idx" ON "_articles_v" USING btree ("version_cover_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_category_idx" ON "_articles_v" USING btree ("version_category_id");
  CREATE INDEX "_articles_v_version_meta_version_meta_image_idx" ON "_articles_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "_articles_v_autosave_idx" ON "_articles_v" USING btree ("autosave");
  CREATE INDEX "_articles_v_rels_order_idx" ON "_articles_v_rels" USING btree ("order");
  CREATE INDEX "_articles_v_rels_parent_idx" ON "_articles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_articles_v_rels_path_idx" ON "_articles_v_rels" USING btree ("path");
  CREATE INDEX "_articles_v_rels_articles_id_idx" ON "_articles_v_rels" USING btree ("articles_id");
  CREATE INDEX "_articles_v_rels_tools_id_idx" ON "_articles_v_rels" USING btree ("tools_id");
  CREATE INDEX "_articles_v_rels_tags_id_idx" ON "_articles_v_rels" USING btree ("tags_id");
  CREATE INDEX "_articles_v_rels_authors_id_idx" ON "_articles_v_rels" USING btree ("authors_id");
  CREATE INDEX "comparisons_criteria_order_idx" ON "comparisons_criteria" USING btree ("_order");
  CREATE INDEX "comparisons_criteria_parent_id_idx" ON "comparisons_criteria" USING btree ("_parent_id");
  CREATE INDEX "comparisons_faq_order_idx" ON "comparisons_faq" USING btree ("_order");
  CREATE INDEX "comparisons_faq_parent_id_idx" ON "comparisons_faq" USING btree ("_parent_id");
  CREATE INDEX "comparisons_sources_order_idx" ON "comparisons_sources" USING btree ("_order");
  CREATE INDEX "comparisons_sources_parent_id_idx" ON "comparisons_sources" USING btree ("_parent_id");
  CREATE INDEX "comparisons_tool_a_idx" ON "comparisons" USING btree ("tool_a_id");
  CREATE INDEX "comparisons_tool_b_idx" ON "comparisons" USING btree ("tool_b_id");
  CREATE INDEX "comparisons_cover_idx" ON "comparisons" USING btree ("cover_id");
  CREATE UNIQUE INDEX "comparisons_slug_idx" ON "comparisons" USING btree ("slug");
  CREATE INDEX "comparisons_meta_meta_image_idx" ON "comparisons" USING btree ("meta_image_id");
  CREATE INDEX "comparisons_updated_at_idx" ON "comparisons" USING btree ("updated_at");
  CREATE INDEX "comparisons_created_at_idx" ON "comparisons" USING btree ("created_at");
  CREATE INDEX "comparisons__status_idx" ON "comparisons" USING btree ("_status");
  CREATE INDEX "_comparisons_v_version_criteria_order_idx" ON "_comparisons_v_version_criteria" USING btree ("_order");
  CREATE INDEX "_comparisons_v_version_criteria_parent_id_idx" ON "_comparisons_v_version_criteria" USING btree ("_parent_id");
  CREATE INDEX "_comparisons_v_version_faq_order_idx" ON "_comparisons_v_version_faq" USING btree ("_order");
  CREATE INDEX "_comparisons_v_version_faq_parent_id_idx" ON "_comparisons_v_version_faq" USING btree ("_parent_id");
  CREATE INDEX "_comparisons_v_version_sources_order_idx" ON "_comparisons_v_version_sources" USING btree ("_order");
  CREATE INDEX "_comparisons_v_version_sources_parent_id_idx" ON "_comparisons_v_version_sources" USING btree ("_parent_id");
  CREATE INDEX "_comparisons_v_parent_idx" ON "_comparisons_v" USING btree ("parent_id");
  CREATE INDEX "_comparisons_v_version_version_tool_a_idx" ON "_comparisons_v" USING btree ("version_tool_a_id");
  CREATE INDEX "_comparisons_v_version_version_tool_b_idx" ON "_comparisons_v" USING btree ("version_tool_b_id");
  CREATE INDEX "_comparisons_v_version_version_cover_idx" ON "_comparisons_v" USING btree ("version_cover_id");
  CREATE INDEX "_comparisons_v_version_version_slug_idx" ON "_comparisons_v" USING btree ("version_slug");
  CREATE INDEX "_comparisons_v_version_meta_version_meta_image_idx" ON "_comparisons_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_comparisons_v_version_version_updated_at_idx" ON "_comparisons_v" USING btree ("version_updated_at");
  CREATE INDEX "_comparisons_v_version_version_created_at_idx" ON "_comparisons_v" USING btree ("version_created_at");
  CREATE INDEX "_comparisons_v_version_version__status_idx" ON "_comparisons_v" USING btree ("version__status");
  CREATE INDEX "_comparisons_v_created_at_idx" ON "_comparisons_v" USING btree ("created_at");
  CREATE INDEX "_comparisons_v_updated_at_idx" ON "_comparisons_v" USING btree ("updated_at");
  CREATE INDEX "_comparisons_v_latest_idx" ON "_comparisons_v" USING btree ("latest");
  CREATE INDEX "_comparisons_v_autosave_idx" ON "_comparisons_v" USING btree ("autosave");
  CREATE INDEX "tools_use_cases_order_idx" ON "tools_use_cases" USING btree ("_order");
  CREATE INDEX "tools_use_cases_parent_id_idx" ON "tools_use_cases" USING btree ("_parent_id");
  CREATE INDEX "tools_limitations_order_idx" ON "tools_limitations" USING btree ("_order");
  CREATE INDEX "tools_limitations_parent_id_idx" ON "tools_limitations" USING btree ("_parent_id");
  CREATE INDEX "tools_faq_order_idx" ON "tools_faq" USING btree ("_order");
  CREATE INDEX "tools_faq_parent_id_idx" ON "tools_faq" USING btree ("_parent_id");
  CREATE INDEX "tools_sources_order_idx" ON "tools_sources" USING btree ("_order");
  CREATE INDEX "tools_sources_parent_id_idx" ON "tools_sources" USING btree ("_parent_id");
  CREATE INDEX "tools_tasks_order_idx" ON "tools_tasks" USING btree ("order");
  CREATE INDEX "tools_tasks_parent_idx" ON "tools_tasks" USING btree ("parent_id");
  CREATE INDEX "tools_platforms_order_idx" ON "tools_platforms" USING btree ("order");
  CREATE INDEX "tools_platforms_parent_idx" ON "tools_platforms" USING btree ("parent_id");
  CREATE INDEX "tools_logo_idx" ON "tools" USING btree ("logo_id");
  CREATE UNIQUE INDEX "tools_slug_idx" ON "tools" USING btree ("slug");
  CREATE INDEX "tools_meta_meta_image_idx" ON "tools" USING btree ("meta_image_id");
  CREATE INDEX "tools_updated_at_idx" ON "tools" USING btree ("updated_at");
  CREATE INDEX "tools_created_at_idx" ON "tools" USING btree ("created_at");
  CREATE INDEX "tools__status_idx" ON "tools" USING btree ("_status");
  CREATE INDEX "tools_rels_order_idx" ON "tools_rels" USING btree ("order");
  CREATE INDEX "tools_rels_parent_idx" ON "tools_rels" USING btree ("parent_id");
  CREATE INDEX "tools_rels_path_idx" ON "tools_rels" USING btree ("path");
  CREATE INDEX "tools_rels_tags_id_idx" ON "tools_rels" USING btree ("tags_id");
  CREATE INDEX "_tools_v_version_use_cases_order_idx" ON "_tools_v_version_use_cases" USING btree ("_order");
  CREATE INDEX "_tools_v_version_use_cases_parent_id_idx" ON "_tools_v_version_use_cases" USING btree ("_parent_id");
  CREATE INDEX "_tools_v_version_limitations_order_idx" ON "_tools_v_version_limitations" USING btree ("_order");
  CREATE INDEX "_tools_v_version_limitations_parent_id_idx" ON "_tools_v_version_limitations" USING btree ("_parent_id");
  CREATE INDEX "_tools_v_version_faq_order_idx" ON "_tools_v_version_faq" USING btree ("_order");
  CREATE INDEX "_tools_v_version_faq_parent_id_idx" ON "_tools_v_version_faq" USING btree ("_parent_id");
  CREATE INDEX "_tools_v_version_sources_order_idx" ON "_tools_v_version_sources" USING btree ("_order");
  CREATE INDEX "_tools_v_version_sources_parent_id_idx" ON "_tools_v_version_sources" USING btree ("_parent_id");
  CREATE INDEX "_tools_v_version_tasks_order_idx" ON "_tools_v_version_tasks" USING btree ("order");
  CREATE INDEX "_tools_v_version_tasks_parent_idx" ON "_tools_v_version_tasks" USING btree ("parent_id");
  CREATE INDEX "_tools_v_version_platforms_order_idx" ON "_tools_v_version_platforms" USING btree ("order");
  CREATE INDEX "_tools_v_version_platforms_parent_idx" ON "_tools_v_version_platforms" USING btree ("parent_id");
  CREATE INDEX "_tools_v_parent_idx" ON "_tools_v" USING btree ("parent_id");
  CREATE INDEX "_tools_v_version_version_logo_idx" ON "_tools_v" USING btree ("version_logo_id");
  CREATE INDEX "_tools_v_version_version_slug_idx" ON "_tools_v" USING btree ("version_slug");
  CREATE INDEX "_tools_v_version_meta_version_meta_image_idx" ON "_tools_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_tools_v_version_version_updated_at_idx" ON "_tools_v" USING btree ("version_updated_at");
  CREATE INDEX "_tools_v_version_version_created_at_idx" ON "_tools_v" USING btree ("version_created_at");
  CREATE INDEX "_tools_v_version_version__status_idx" ON "_tools_v" USING btree ("version__status");
  CREATE INDEX "_tools_v_created_at_idx" ON "_tools_v" USING btree ("created_at");
  CREATE INDEX "_tools_v_updated_at_idx" ON "_tools_v" USING btree ("updated_at");
  CREATE INDEX "_tools_v_latest_idx" ON "_tools_v" USING btree ("latest");
  CREATE INDEX "_tools_v_autosave_idx" ON "_tools_v" USING btree ("autosave");
  CREATE INDEX "_tools_v_rels_order_idx" ON "_tools_v_rels" USING btree ("order");
  CREATE INDEX "_tools_v_rels_parent_idx" ON "_tools_v_rels" USING btree ("parent_id");
  CREATE INDEX "_tools_v_rels_path_idx" ON "_tools_v_rels" USING btree ("path");
  CREATE INDEX "_tools_v_rels_tags_id_idx" ON "_tools_v_rels" USING btree ("tags_id");
  CREATE INDEX "prompts_variables_order_idx" ON "prompts_variables" USING btree ("_order");
  CREATE INDEX "prompts_variables_parent_id_idx" ON "prompts_variables" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "prompts_slug_idx" ON "prompts" USING btree ("slug");
  CREATE INDEX "prompts_meta_meta_image_idx" ON "prompts" USING btree ("meta_image_id");
  CREATE INDEX "prompts_updated_at_idx" ON "prompts" USING btree ("updated_at");
  CREATE INDEX "prompts_created_at_idx" ON "prompts" USING btree ("created_at");
  CREATE INDEX "prompts__status_idx" ON "prompts" USING btree ("_status");
  CREATE INDEX "prompts_rels_order_idx" ON "prompts_rels" USING btree ("order");
  CREATE INDEX "prompts_rels_parent_idx" ON "prompts_rels" USING btree ("parent_id");
  CREATE INDEX "prompts_rels_path_idx" ON "prompts_rels" USING btree ("path");
  CREATE INDEX "prompts_rels_tools_id_idx" ON "prompts_rels" USING btree ("tools_id");
  CREATE INDEX "_prompts_v_version_variables_order_idx" ON "_prompts_v_version_variables" USING btree ("_order");
  CREATE INDEX "_prompts_v_version_variables_parent_id_idx" ON "_prompts_v_version_variables" USING btree ("_parent_id");
  CREATE INDEX "_prompts_v_parent_idx" ON "_prompts_v" USING btree ("parent_id");
  CREATE INDEX "_prompts_v_version_version_slug_idx" ON "_prompts_v" USING btree ("version_slug");
  CREATE INDEX "_prompts_v_version_meta_version_meta_image_idx" ON "_prompts_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_prompts_v_version_version_updated_at_idx" ON "_prompts_v" USING btree ("version_updated_at");
  CREATE INDEX "_prompts_v_version_version_created_at_idx" ON "_prompts_v" USING btree ("version_created_at");
  CREATE INDEX "_prompts_v_version_version__status_idx" ON "_prompts_v" USING btree ("version__status");
  CREATE INDEX "_prompts_v_created_at_idx" ON "_prompts_v" USING btree ("created_at");
  CREATE INDEX "_prompts_v_updated_at_idx" ON "_prompts_v" USING btree ("updated_at");
  CREATE INDEX "_prompts_v_latest_idx" ON "_prompts_v" USING btree ("latest");
  CREATE INDEX "_prompts_v_autosave_idx" ON "_prompts_v" USING btree ("autosave");
  CREATE INDEX "_prompts_v_rels_order_idx" ON "_prompts_v_rels" USING btree ("order");
  CREATE INDEX "_prompts_v_rels_parent_idx" ON "_prompts_v_rels" USING btree ("parent_id");
  CREATE INDEX "_prompts_v_rels_path_idx" ON "_prompts_v_rels" USING btree ("path");
  CREATE INDEX "_prompts_v_rels_tools_id_idx" ON "_prompts_v_rels" USING btree ("tools_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages" USING btree ("meta_image_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "authors_links_order_idx" ON "authors_links" USING btree ("_order");
  CREATE INDEX "authors_links_parent_id_idx" ON "authors_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "authors_slug_idx" ON "authors" USING btree ("slug");
  CREATE INDEX "authors_avatar_idx" ON "authors" USING btree ("avatar_id");
  CREATE INDEX "authors_updated_at_idx" ON "authors" USING btree ("updated_at");
  CREATE INDEX "authors_created_at_idx" ON "authors" USING btree ("created_at");
  CREATE INDEX "ad_slots_image_idx" ON "ad_slots" USING btree ("image_id");
  CREATE INDEX "ad_slots_updated_at_idx" ON "ad_slots" USING btree ("updated_at");
  CREATE INDEX "ad_slots_created_at_idx" ON "ad_slots" USING btree ("created_at");
  CREATE UNIQUE INDEX "subscribers_email_idx" ON "subscribers" USING btree ("email");
  CREATE INDEX "subscribers_updated_at_idx" ON "subscribers" USING btree ("updated_at");
  CREATE INDEX "subscribers_created_at_idx" ON "subscribers" USING btree ("created_at");
  CREATE INDEX "messages_updated_at_idx" ON "messages" USING btree ("updated_at");
  CREATE INDEX "messages_created_at_idx" ON "messages" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_author_idx" ON "users" USING btree ("author_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_comparisons_id_idx" ON "payload_locked_documents_rels" USING btree ("comparisons_id");
  CREATE INDEX "payload_locked_documents_rels_tools_id_idx" ON "payload_locked_documents_rels" USING btree ("tools_id");
  CREATE INDEX "payload_locked_documents_rels_prompts_id_idx" ON "payload_locked_documents_rels" USING btree ("prompts_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_authors_id_idx" ON "payload_locked_documents_rels" USING btree ("authors_id");
  CREATE INDEX "payload_locked_documents_rels_ad_slots_id_idx" ON "payload_locked_documents_rels" USING btree ("ad_slots_id");
  CREATE INDEX "payload_locked_documents_rels_subscribers_id_idx" ON "payload_locked_documents_rels" USING btree ("subscribers_id");
  CREATE INDEX "payload_locked_documents_rels_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("messages_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_featured_idx" ON "home" USING btree ("featured_id");
  CREATE INDEX "home_rels_order_idx" ON "home_rels" USING btree ("order");
  CREATE INDEX "home_rels_parent_idx" ON "home_rels" USING btree ("parent_id");
  CREATE INDEX "home_rels_path_idx" ON "home_rels" USING btree ("path");
  CREATE INDEX "home_rels_articles_id_idx" ON "home_rels" USING btree ("articles_id");
  CREATE INDEX "home_rels_comparisons_id_idx" ON "home_rels" USING btree ("comparisons_id");
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "articles_faq" CASCADE;
  DROP TABLE "articles_sources" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "_articles_v_version_faq" CASCADE;
  DROP TABLE "_articles_v_version_sources" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_rels" CASCADE;
  DROP TABLE "comparisons_criteria" CASCADE;
  DROP TABLE "comparisons_faq" CASCADE;
  DROP TABLE "comparisons_sources" CASCADE;
  DROP TABLE "comparisons" CASCADE;
  DROP TABLE "_comparisons_v_version_criteria" CASCADE;
  DROP TABLE "_comparisons_v_version_faq" CASCADE;
  DROP TABLE "_comparisons_v_version_sources" CASCADE;
  DROP TABLE "_comparisons_v" CASCADE;
  DROP TABLE "tools_use_cases" CASCADE;
  DROP TABLE "tools_limitations" CASCADE;
  DROP TABLE "tools_faq" CASCADE;
  DROP TABLE "tools_sources" CASCADE;
  DROP TABLE "tools_tasks" CASCADE;
  DROP TABLE "tools_platforms" CASCADE;
  DROP TABLE "tools" CASCADE;
  DROP TABLE "tools_rels" CASCADE;
  DROP TABLE "_tools_v_version_use_cases" CASCADE;
  DROP TABLE "_tools_v_version_limitations" CASCADE;
  DROP TABLE "_tools_v_version_faq" CASCADE;
  DROP TABLE "_tools_v_version_sources" CASCADE;
  DROP TABLE "_tools_v_version_tasks" CASCADE;
  DROP TABLE "_tools_v_version_platforms" CASCADE;
  DROP TABLE "_tools_v" CASCADE;
  DROP TABLE "_tools_v_rels" CASCADE;
  DROP TABLE "prompts_variables" CASCADE;
  DROP TABLE "prompts" CASCADE;
  DROP TABLE "prompts_rels" CASCADE;
  DROP TABLE "_prompts_v_version_variables" CASCADE;
  DROP TABLE "_prompts_v" CASCADE;
  DROP TABLE "_prompts_v_rels" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "authors_links" CASCADE;
  DROP TABLE "authors" CASCADE;
  DROP TABLE "ad_slots" CASCADE;
  DROP TABLE "subscribers" CASCADE;
  DROP TABLE "messages" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "home_rels" CASCADE;
  DROP TABLE "site_settings_socials" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_articles_section";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_section";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum_comparisons_status";
  DROP TYPE "public"."enum__comparisons_v_version_status";
  DROP TYPE "public"."enum_tools_tasks";
  DROP TYPE "public"."enum_tools_platforms";
  DROP TYPE "public"."enum_tools_color";
  DROP TYPE "public"."enum_tools_category";
  DROP TYPE "public"."enum_tools_pricing";
  DROP TYPE "public"."enum_tools_status";
  DROP TYPE "public"."enum__tools_v_version_tasks";
  DROP TYPE "public"."enum__tools_v_version_platforms";
  DROP TYPE "public"."enum__tools_v_version_color";
  DROP TYPE "public"."enum__tools_v_version_category";
  DROP TYPE "public"."enum__tools_v_version_pricing";
  DROP TYPE "public"."enum__tools_v_version_status";
  DROP TYPE "public"."enum_prompts_category";
  DROP TYPE "public"."enum_prompts_status";
  DROP TYPE "public"."enum__prompts_v_version_category";
  DROP TYPE "public"."enum__prompts_v_version_status";
  DROP TYPE "public"."enum_pages_form";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_form";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_categories_color";
  DROP TYPE "public"."enum_categories_icon";
  DROP TYPE "public"."enum_tags_icon";
  DROP TYPE "public"."enum_tags_color";
  DROP TYPE "public"."enum_ad_slots_placement";
  DROP TYPE "public"."enum_ad_slots_kind";
  DROP TYPE "public"."enum_messages_topic";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
