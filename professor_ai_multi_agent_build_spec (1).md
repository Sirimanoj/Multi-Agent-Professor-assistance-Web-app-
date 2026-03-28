# Professor AI Multi-Agent Assistant
## Build Specification for Antigravity

## 1. Project Summary

Build a web application that works like a **professor assistant system** for a university course.

The system must have:
- **Two separate authentication roles**
  - **Professor**
  - **Student**
- **Two separate dashboards**
  - Professor admin/control side
  - Student learning/access side
- **Multi-agent AI architecture**
  - Syllabus agent
  - Grading agent
  - Professor knowledge/chat agent
  - Notification/reminder agent
  - Analytics/reporting agent
  - Optional integrity/plagiarism agent
- **Transparency**
  - Students can see their own grades, rubric feedback, progress, and submission history
  - Professor can see all class data, edit grades, and monitor performance
- **Classroom model**
  - Professor creates classrooms/courses
  - Students join using invite code or approved enrollment

This is not an exact clone of the professor. It is a **professor-style assistant** that reflects the professor’s teaching style, vocabulary, structure, examples, and course logic, while staying safe, accurate, and editable by the professor.

---

## 2. Product Goal

The goal of this system is to reduce the professor’s workload and improve student learning by automating:

- syllabus organization
- course material sharing
- question answering
- assignment and exam management
- rubric-based grading
- progress tracking
- reminders and announcements
- class analytics

The app should feel like a smart classroom manager plus an intelligent teaching assistant.

---

## 3. Core User Roles

### 3.1 Professor Role
The professor must be able to:

- log in securely
- create and manage classrooms
- upload syllabus, lecture notes, assignments, exams, answer keys, and reference documents
- define rubrics
- set deadlines
- review AI-generated grades
- edit or override grades manually
- view analytics and student performance
- manage student enrollment
- publish announcements
- control what the AI can answer
- approve or reject the AI’s response style/profile

### 3.2 Student Role
The student must be able to:

- log in securely
- join the correct classroom
- view syllabus and all shared materials
- ask questions in chat
- see AI answers grounded in professor content
- submit assignments
- view grades and rubric feedback
- view progress over time
- see announcements and deadlines
- see transparent grading history for their own work

---

## 4. Authentication and Access Control

### 4.1 Authentication Types
Use two authentication layers:

1. **Role-based login**
   - Professor account
   - Student account

2. **Classroom access control**
   - Professor can create and manage class access codes
   - Students can only enter approved classrooms

### 4.2 Recommended Security Rules
- Use RBAC (Role-Based Access Control)
- Professor can access everything inside their own classroom
- Students can only access:
  - classrooms they are enrolled in
  - their own submissions
  - their own grades
  - shared course content
- No student should see another student’s personal grade or private submission
- All sensitive data must be logged
- Add an audit trail for grade changes, file uploads, and AI-generated responses

### 4.3 Optional Login Methods
- Email/password
- University SSO
- Google login
- One-time classroom invite code

---

## 5. Main App Structure

## A. Professor Dashboard
This is the professor control panel.

### Pages / Modules
- Dashboard home
- Classrooms
- Course materials
- Syllabus editor
- Assignments
- Exams
- Rubrics
- Gradebook
- Student list
- AI chat configuration
- Analytics
- Notifications
- Audit logs
- Settings

### Professor Actions
- create a classroom
- upload syllabus PDF/document
- upload lecture slides
- upload assignment instructions
- upload exams and answer keys
- create grading rubrics
- publish and unpublish material
- review AI grading
- edit grades manually
- broadcast announcements
- approve AI style profile
- inspect system logs

---

## B. Student Dashboard
This is the student learning portal.

### Pages / Modules
- Dashboard home
- My classrooms
- Syllabus and materials
- Assignment submission
- Exam section
- Grades and feedback
- Progress tracker
- AI chat assistant
- Announcements
- Calendar / deadlines
- Help / support

### Student Actions
- view shared materials
- open syllabus by week/topic
- ask the AI questions
- submit homework
- check grade status
- see rubric-level feedback
- track improvement
- receive notifications and reminders

---

## 6. Multi-Agent System Design

The app must use a **multi-agent architecture**, not a single all-purpose AI.

### 6.1 Orchestrator Agent
This is the central controller.

Responsibilities:
- receive user request
- identify user role
- route task to the correct agent
- maintain session context
- combine results from multiple agents
- store final response
- enforce permissions and policy

The orchestrator should decide:
- Is this a content question?
- Is this grading-related?
- Is this a syllabus or file lookup?
- Is this a professor-only request?
- Is this a student-safe response?

---

### 6.2 Syllabus Agent
Responsibilities:
- read syllabus file
- extract topics, modules, weeks, dates, and learning outcomes
- organize content into a structured timeline
- generate study roadmap
- answer syllabus-related questions
- map assignments to syllabus topics

Outputs:
- syllabus summary
- week-wise topic plan
- topic-to-material mapping
- reminders for upcoming topics

---

### 6.3 Grading Agent
Responsibilities:
- evaluate submissions using professor rubrics
- handle objective questions automatically
- handle subjective answers with rubric-based scoring
- generate explainable feedback
- compare student answer with expected answer
- identify missing points
- provide score breakdown

Must support:
- MCQ grading
- short answer grading
- essay grading
- coding assignment grading
- project rubric grading

Important:
- grading must be transparent
- the system should not only return a final score
- it should show why the score was assigned
- professor can override any AI decision

---

### 6.4 Professor Knowledge / Chat Agent
Responsibilities:
- answer student questions in the professor’s teaching style
- use only approved course content and allowed professor materials
- respond with accurate, grounded answers
- explain concepts using professor-like examples and tone
- avoid inventing facts not in course material

How it should work:
- use retrieval from professor’s uploaded documents
- use a style profile from the professor’s previous lectures, notes, and answers
- use prompt engineering or fine-tuning only with professor-approved data
- always cite or reference the course material internally

Important behavior:
- if the AI is unsure, it should say so
- if content is outside course scope, it should redirect the student or ask the professor
- it should feel like “the professor’s teaching style,” not a fake identity claim

---

### 6.5 Notification Agent
Responsibilities:
- send deadline reminders
- notify about new uploads
- notify about grade updates
- notify about announcements
- remind professor about pending grading
- remind students about missing submissions

Channels:
- in-app notification
- email
- optional push notification

---

### 6.6 Analytics Agent
Responsibilities:
- analyze class performance
- show grade distribution
- identify weak topics
- identify commonly missed questions
- track improvement across weeks
- provide professor insights
- generate summary reports

Examples:
- “Most students struggled with Topic 4”
- “Average score improved by 12% after review session”
- “Five students have not submitted Assignment 2”

---

### 6.7 Integrity / Plagiarism Agent
Optional but useful.

Responsibilities:
- detect similarity between submissions
- flag suspiciously similar answers
- compare with known sources when allowed
- check unusual patterns
- support academic integrity review

This agent should only flag issues, not accuse students automatically.

---

## 7. Professor-Style Chat Design

The chat assistant should mimic the professor’s teaching style in a controlled and safe way.

### Required Inputs for Style Building
- professor’s lecture notes
- syllabus
- sample answers
- previous announcements
- recorded Q&A transcripts
- preferred terminology
- preferred examples and analogies
- preferred tone and structure

### Style Goals
The chat should reflect:
- how the professor explains concepts
- what examples the professor prefers
- how formal or friendly the professor is
- which order the professor uses when teaching
- which words or phrases the professor often uses

### Safe Rules
- do not pretend to be the real professor unless explicitly approved
- do not imitate private personal traits
- do not generate content outside professor-approved data without clear labeling
- allow professor to review or edit style responses
- keep a “source grounded” mode for factual answers

### Recommended Technique
Use a combination of:
- retrieval-augmented generation
- prompt templates
- optional fine-tuning on professor-approved content
- style profile settings
- answer filtering and safety checks

---

## 8. Transparent Grading Model

The grading system must be visible and understandable.

### Each grade should show:
- total score
- rubric breakdown
- explanation for each criterion
- AI-generated feedback
- professor override history
- submission timestamp
- revision history if resubmission is allowed

### Example rubric display
- Understanding of concept: 8/10
- Structure and clarity: 7/10
- Completeness: 9/10
- Final score: 24/30

### Transparency Rule
Students should clearly understand:
- how their score was produced
- where they lost marks
- what can be improved
- whether the grade is final or AI-suggested

---

## 9. Recommended Features to Add

### 9.1 Classroom Management
- create multiple classrooms
- create invite codes
- add/remove students
- assign co-teacher or TA role later if needed
- archive old classrooms

### 9.2 Assignment Workflow
- create assignment
- attach rubric
- set due date
- allow file upload / text submission / code submission
- auto-grade when possible
- allow professor review before final release

### 9.3 Exam Workflow
- upload exam
- choose auto-grade or manual-grade mode
- allow answer keys and rubric
- release results in stages

### 9.4 AI Study Support
- generate quiz questions
- generate flashcards
- summarize syllabus section
- explain difficult topics
- suggest revision plan

### 9.5 Student Progress View
- progress by topic
- pending tasks
- completed tasks
- performance trend
- weak areas
- improvement suggestions

### 9.6 Communication
- announcements
- discussion board
- private support messages
- office-hour scheduling
- AI FAQ support

### 9.7 Teacher Control Panel for AI
- set tone
- set allowed topics
- set prohibited responses
- choose whether the AI can answer assignment hints
- set grading strictness
- select confidence threshold for auto-grading
- review logs of AI answers

---

## 10. Data Objects / Database Entities

Design the app around these core objects:

- User
- Role
- Classroom
- Enrollment
- Syllabus
- Module / Week
- Material
- Assignment
- Exam
- Rubric
- Submission
- Grade
- Feedback
- Announcement
- ChatSession
- Message
- Notification
- AuditLog
- AIResponse
- StyleProfile
- AnalyticsReport

---

## 11. Suggested Workflow

### Workflow 1: Professor creates a course
1. Professor logs in
2. Professor creates classroom
3. Professor uploads syllabus
4. Professor uploads materials
5. Professor sets rubric and assignments
6. Professor publishes course for students

### Workflow 2: Student asks a question
1. Student logs in
2. Student opens classroom chat
3. Orchestrator checks role and class access
4. Chat agent retrieves relevant course data
5. Answer is generated in professor-like style
6. Response is shown to student with course-grounded context

### Workflow 3: Student submits assignment
1. Student uploads file or text
2. Submission is stored
3. Grading agent checks rubric and answer
4. System generates score and feedback
5. Professor reviews if review mode is enabled
6. Grade is published to student

### Workflow 4: Professor reviews analytics
1. Professor opens analytics dashboard
2. Agent calculates class-wide trends
3. Dashboard shows weak topics, average score, missing submissions
4. Professor uses report to adjust teaching

---

## 12. UI Design Requirements

The interface should feel modern, clear, and academic.

### Visual Style
- clean dashboard layout
- cards for modules
- sidebar navigation
- role-based home screens
- minimal clutter
- easy file upload
- simple grade visuals
- chat panel with source-backed answers

### Professor Home Screen
Should show:
- active classes
- pending grading
- recent uploads
- class analytics summary
- recent announcements
- AI suggestions

### Student Home Screen
Should show:
- enrolled classes
- upcoming deadlines
- latest grades
- new announcements
- ask AI button
- progress snapshot

---

## 13. Non-Functional Requirements

### Security
- encryption in transit and at rest
- role-based access
- audit logging
- secure file handling
- safe prompt design

### Accuracy
- use only approved course content for course answers
- keep grading explainable
- avoid hallucinations
- allow human review

### Scalability
- support multiple classrooms
- support many students
- modular agent design
- agent replacement should not break the full system

### Reliability
- if AI fails, app should still open files and show stored grades
- manual professor override should always work
- system should fail safely, not silently

---

## 14. Build Phases

## Phase 1: MVP
- login system
- professor dashboard
- student dashboard
- classroom creation
- file upload
- syllabus viewer
- basic chat
- simple grading
- gradebook
- announcements

## Phase 2: Multi-Agent Expansion
- separate syllabus, grading, and chat agents
- transcript-based style profile
- analytics agent
- notification agent
- audit logs

## Phase 3: Advanced Intelligence
- personalized tutoring
- adaptive quizzes
- plagiarism signals
- recommendation engine
- fine-tuned professor-style responses
- smart course planning

---

## 15. Acceptance Criteria

The product should be considered successful if:

- professor and student logins are fully separated
- professor can upload and manage course content
- students can only access allowed content
- AI grading works with rubric explanations
- professor-style chat answers course questions well
- all major actions are logged
- student grades are transparent
- the system feels like an intelligent classroom assistant

---

## 16. Notes for Antigravity Implementation

When generating the app, prioritize these decisions:

1. Build role-based login first
2. Build classroom and content upload flow second
3. Build student view third
4. Add chat and syllabus retrieval
5. Add grading with rubric display
6. Add analytics and notifications
7. Add audit logs and professor controls
8. Keep each AI agent separated logically even if the initial version uses the same underlying model

The app should be structured so that each AI agent can later be replaced by a stronger one without changing the full UI.

---

## 17. Final Vision

This system should become a **smart professor assistant platform** that:
- saves professor time
- helps students learn better
- provides transparent grading
- answers questions in a professor-like style
- manages classrooms efficiently
- uses multiple AI agents in a clean modular way

It should feel like:
- Google Classroom for management
- an AI tutor for guidance
- an auto-grader for evaluation
- a professor’s assistant for daily academic work
