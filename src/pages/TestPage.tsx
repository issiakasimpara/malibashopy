import React from 'react';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-600 mb-4">✅ Application fonctionne !</h1>
        <p className="text-gray-700 mb-4">
          Si vous voyez cette page, l'application React fonctionne correctement.
        </p>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>Port:</strong> 8081</p>
          <p><strong>Status:</strong> En ligne</p>
          <p><strong>Vite:</strong> Actif</p>
        </div>
        <div className="mt-6">
          <a 
            href="/dashboard" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Aller au Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
