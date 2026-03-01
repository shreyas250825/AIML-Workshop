# Workshop Platform - Quick Setup Guide

## What's Built

✅ Login/Signup page (max 60 students)
✅ Dashboard with all sections
✅ 7 Case Studies with password-protected steps
✅ 2 Quizzes with timer and scoring
✅ Leaderboard
✅ Polls system
✅ Doubts page
✅ Feedback page
✅ Materials download

## Current Setup (Simple Auth)

Using localStorage for now - perfect for testing and immediate use.
Data persists in browser during workshop.

## Pages Structure

- `/` - Login page
- `/signup` - Registration (max 60)
- `/dashboard` - Main hub
- `/case-study/[1-7]` - Case study pages
- `/quiz/day1` - Day 1 Quiz
- `/quiz/day2` - Day 2 Quiz
- `/leaderboard` - Rankings
- `/doubts` - Q&A
- `/feedback` - Feedback form
- `/materials` - Downloads

## Passwords for Steps

You can set these in the admin panel or directly in code.
Default: Each step has a simple password you'll share during workshop.

## To Run

```bash
npm run dev
```

Visit http://localhost:3000

## Admin Access

Email: admin@workshop.com
Password: admin123

## Student Registration

Students sign up with:
- Name
- USN (University Seat Number)
- Email
- Password

Max 60 students enforced.

## Next Steps (Optional - Supabase)

When ready to add Supabase:
1. Create Supabase project
2. Run SQL schema (provided in SUPABASE_SCHEMA.sql)
3. Update environment variables
4. Replace localStorage with Supabase calls

For now, everything works with localStorage!
