import profilePicture from '../../assets/profilepicutre.png';

const About = () => {
  const skills = {
    Frontend: [
      'React.js',
      'Next.js',
      'TypeScript',
      'JavaScript (ES6+)',
      'HTML5',
      'CSS3',
      'Tailwind CSS'
    ],
    Backend: [
      'Django',
      'Flask',
      'FastAPI'
    ],
    'Database & Backend Services': [
      'Supabase (Auth, Database, Storage)',
      'Firebase (Auth, Firestore, Realtime Database)',
      'PostgreSQL',
      'MySQL'
    ],
    'Tools & Technologies': [
      'Git & GitHub',
      'VS Code',
      'Vite',
      'XAMPP',
      'Postman'
    ]
  };

  return (
    <div className="min-h-[calc(100vh-120px)] w-full py-8 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-7 md:gap-8">
          {/* Left Sidebar - Personal Information Card */}
          <div className="w-full lg:w-1/3 shrink-0">
            <div className="bg-black/40 border-2 border-white/20 rounded-lg p-4 sm:p-5 md:p-6 backdrop-blur-sm">
              {/* Profile Picture */}
              <div className="flex justify-center mb-4 sm:mb-5 md:mb-6">
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border-2 border-white overflow-hidden transition-all duration-300 hover:shadow-[0_15px_50px_rgba(255,255,255,0.6)] hover:border-white/80 hover:scale-110 hover:translate-y-[-10px]">
                  <img 
                    src={profilePicture} 
                    alt="Rhenel" 
                    className="w-full h-full rounded-full object-contain"
                    style={{
                      objectPosition: 'center center'
                    }}
                  />
                </div>
              </div>

              {/* Name and Title */}
              <div className="text-center mb-4 sm:mb-5 md:mb-6">
                <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
                  Rhenel Jhon Sajol
                </h3>
                <p className="text-gray-300 text-base sm:text-lg mb-1">
                  Computer Science Student
                </p>
                <p className="text-gray-400 text-sm sm:text-base">
                  Aspiring Developer
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 sm:space-y-3 text-white text-sm sm:text-base">
                <div className="wrap-break-word">
                  <span className="text-gray-400">Email: </span>
                  <span className="text-gray-300 break-all">sajol.rhenel123@gmail.com</span>
                </div>
                <div>
                  <span className="text-gray-400">Phone: </span>
                  <span className="text-gray-300">09536145105</span>
                </div>
                <div>
                  <span className="text-gray-400">Address: </span>
                  <span className="text-gray-300">Cagayan De Oro, Philippines</span>
                </div>
                <div className="wrap-break-word">
                  <span className="text-gray-400">College: </span>
                  <span className="text-gray-300">University of Science and Technology of Southern Philippines</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Biography and Skills Cards */}
          <div className="w-full lg:w-2/3 flex-1 space-y-6 sm:space-y-7 md:space-y-8">
            {/* Biography Card */}
            <div className="bg-black/40 border-2 border-white/20 rounded-lg p-4 sm:p-5 md:p-6 backdrop-blur-sm transition-all duration-300 hover:border-pink-300 hover:shadow-[0_10px_35px_rgba(236,72,153,0.6)] hover:translate-y-[-8px] hover:scale-105">
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                Biography
              </h3>
              <p className="text-white text-sm sm:text-base leading-relaxed">
              I am Rhene Jhon Sajol, a Computer Science student with a strong interest in full-stack web development. I have experience with frontend technologies such as React.js, Next.js, TypeScript, and Tailwind CSS, as well as backend technologies including Django, Flask, and FastAPI. I also work with Supabase for authentication, databases, and backend services. My focus is on building functional systems, writing clean and maintainable code, and continuously improving my skills in UI design and real-world web application development.
              </p>
            </div>

            {/* Skills Card */}
            <div className="bg-black/40 border-2 border-white/20 rounded-lg p-4 sm:p-5 md:p-6 backdrop-blur-sm transition-all duration-300 hover:border-pink-300 hover:shadow-[0_10px_35px_rgba(236,72,153,0.6)] hover:translate-y-[-8px] hover:scale-105">
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-4 sm:mb-5 md:mb-6">
                Skills
              </h3>
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="text-white text-base sm:text-lg font-semibold mb-2 sm:mb-3">
                      {category}:
                    </h4>
                    <div className="bg-black/60 border border-white/10 rounded-lg p-3 sm:p-4 min-h-[60px]">
                      <div className="flex flex-wrap gap-2">
                        {items.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 sm:px-3 py-1 bg-white/10 border border-white/20 rounded text-white text-xs sm:text-sm transition-all duration-300 hover:bg-pink-500/20 hover:border-pink-300 hover:scale-105"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

