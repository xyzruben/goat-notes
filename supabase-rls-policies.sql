-- =====================================================
-- Row-Level Security (RLS) Policies for Goat Notes
-- =====================================================
-- This script enables RLS and creates policies for secure
-- multi-tenant data isolation on Supabase.
--
-- IMPORTANT: Run this script in your Supabase SQL Editor
-- =====================================================

-- Enable Row-Level Security on User table
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Enable Row-Level Security on Note table
ALTER TABLE "Note" ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- User Table Policies
-- =====================================================

-- Policy: Users can only read their own user record
CREATE POLICY "Users can read own record"
ON "User"
FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can update their own user record
CREATE POLICY "Users can update own record"
ON "User"
FOR UPDATE
USING (auth.uid() = id);

-- Note: User creation is handled by the application via service role
-- so we don't need an INSERT policy for regular users

-- =====================================================
-- Note Table Policies
-- =====================================================

-- Policy: Users can only read their own notes
CREATE POLICY "Users can read own notes"
ON "Note"
FOR SELECT
USING (auth.uid() = "authorId");

-- Policy: Users can only insert notes with their own authorId
CREATE POLICY "Users can insert own notes"
ON "Note"
FOR INSERT
WITH CHECK (auth.uid() = "authorId");

-- Policy: Users can only update their own notes
CREATE POLICY "Users can update own notes"
ON "Note"
FOR UPDATE
USING (auth.uid() = "authorId");

-- Policy: Users can only delete their own notes
CREATE POLICY "Users can delete own notes"
ON "Note"
FOR DELETE
USING (auth.uid() = "authorId");

-- =====================================================
-- Verification Queries
-- =====================================================
-- Run these queries to verify RLS is enabled:
--
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- AND tablename IN ('User', 'Note');
--
-- To view all policies:
-- SELECT * FROM pg_policies WHERE tablename IN ('User', 'Note');
-- =====================================================
