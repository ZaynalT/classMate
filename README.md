# ClassMate - Course Management Application

A modern web application for managing courses, assignments, and grades. Built with SvelteKit and TypeScript.

## Features

### Course Management
- Create and manage multiple courses
- View course overview with upcoming assignments
- Track course progress and completion rates
- Alphabetical sorting of courses
- Search functionality to filter courses

### Assignment Management
- Add new assignments with due dates and descriptions
- Mark assignments as complete
- Track assignment status (pending/completed)
- View upcoming assignments with time remaining
- Click on assignments to view detailed information

### Grade System
- Letter grade system (A, B, C, D, E, F)
- Color-coded grade display
- Progress bars for visual grade representation
- Average grade calculation with percentage
- Grade history tracking

### Navigation
- Breadcrumb navigation for easy page hierarchy
- Course-specific navigation tabs
- Back to courses button
- Intuitive navigation between course sections

### Daily Memo
- Track daily progress
- Record time spent on assignments
- Add notes and goals
- View memo history

### User Interface
- Clean and modern design
- Responsive layout
- Color-coded status indicators
- Progress visualization
- Consistent styling across all pages

## Technical Features
- Built with SvelteKit
- TypeScript for type safety
- SCSS for styling
- Local storage for data persistence
- Responsive design
- Component-based architecture

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
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── lib/
│   ├── components/     # Reusable components
│   └── styles/        # Global styles and variables
├── routes/
│   ├── courses/       # Course-related pages
│   ├── profile/       # User profile
│   └── assignments/   # Assignment management
└── app.html          # Main HTML template
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 