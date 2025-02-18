<<<<<<< HEAD
# Quizz
=======
# Interactive Quiz Platform

A modern, animated quiz application built with Next.js, Three.js, and Framer Motion.

## Features

- Interactive 3D landing page with floating mathematical symbols
- Timer-based questions (30 seconds per question)
- Multiple choice and integer-type questions
- Instant feedback on answers
- Progress tracking with IndexedDB
- Responsive design
- Animated transitions between questions
- Previous attempts history

## Tech Stack

- Next.js 13+ (App Router)
- Three.js for 3D animations
- Framer Motion for UI animations
- Tailwind CSS for styling
- shadcn/ui for UI components
- IndexedDB for local storage
- TypeScript for type safety

## Running Locally

1. Clone the repository:
   \```bash
   git clone https://github.com/yourusername/quiz-platform.git
   \```

2. Install dependencies:
   \```bash
   cd quiz-platform
   npm install
   \```

3. Start the development server:
   \```bash
   npm run dev
   \```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The application is deployed on Vercel and can be accessed at: [Quiz Platform](https://your-deployment-url.vercel.app)

## Project Structure

- `/app` - Next.js app router pages
- `/components` - Reusable UI components
- `/lib` - Utility functions and data
- `/styles` - Global styles and Tailwind configuration
- `/public` - Static assets

## Features in Detail

### Quiz Logic
- Multiple choice and integer questions
- 30-second timer per question
- Instant feedback on answers
- Progress tracking

### User Interface
- Animated 3D background
- Responsive design
- Smooth transitions
- Progress indicators

### Data Persistence
- IndexedDB for storing quiz attempts
- History tracking
- Score calculation

## License

MIT

>>>>>>> 7f01e40 (Initial commit)
