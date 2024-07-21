// app/page.tsx
import QuizComponent from './QuizComponent';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Quiz App</h1>
        <QuizComponent />
      </div>
    </main>
  );
}