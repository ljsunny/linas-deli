// DonationSuccess.jsx
const DonationSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-yellow-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
        <div className="text-6xl mb-4">💝</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h1>
        <p className="text-gray-600 mb-6">
          Your support means the world to us!<br />
          Thank you for helping Lina's Deli continue serving our community.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default DonationSuccess;