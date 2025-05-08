# ClassMate - Student Course Management System

ClassMate is a modern web application designed to help students manage their courses, assignments, and track their academic progress. Built with SvelteKit, it provides an intuitive interface for organizing academic tasks and monitoring performance. It also gives the parents an simple way to overview and help them identify where the student lacks and can improve

## Features

### Course Management
- View all enrolled courses
- Add new courses
- Course overview with key information
- Navigation between course sections

### Assignment Tracking
- Create and manage assignments for each course
- Set due dates and descriptions
- Mark assignments as completed
- Grade assignments using letter grades (A-F)
- View assignment details including:
  - Assignment name and description
  - Due date
  - Completion status
  - Grade (if completed)
  - Daily progress tracking through memos

### Grade Overview
- Visual representation of assignment grades
- Progress bars for each completed assignment
- Color-coded grade indicators
- Average grade calculation
- Grade distribution visualization

### Daily Progress Tracking
- Add daily memos for each assignment
- Track progress towards assignment goals
- Chronological list of daily activities
- Timestamp for each memo entry
- Persistent storage of progress notes

## Technical Features

### Modern UI/UX
- Responsive design
- Clean and intuitive interface
- Smooth transitions and animations
- Consistent styling across all pages

### Data Management
- Local storage for data persistence
- Real-time updates
- Efficient state management
- Type-safe implementation with TypeScript

### Navigation
- Intuitive course navigation
- Easy access to all features
- Clear visual hierarchy
- Consistent navigation patterns

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── CourseNavigation.svelte
│   │   ├── AddAssignmentForm.svelte
│   │   └── DailyMemo.svelte
│   └── styles/
│       └── _variables.scss
├── routes/
│   ├── courses/
│   │   ├── [id]/
│   │   │   ├── overview/
│   │   │   ├── assignments/
│   │   │   │   └── [assignmentId]/
│   │   │   └── grade-graph/
│   │   └── +page.svelte
│   └── +layout.svelte
└── app.html
```

## Technologies Used

- SvelteKit
- TypeScript
- SCSS
- Local Storage API

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 