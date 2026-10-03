import profilePicture from '../../assets/Gemini_Generated_Image_nwsi8fnwsi8fnwsi.jpeg';

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
    'DevOps & Cloud Platforms': [
      'Docker',
      'AWS',
      'Vercel',
      'Git & GitHub'
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
            <div className="glass-3d rounded-2xl p-6 sm:p-8">
              {/* Profile Picture */}
              <div className="relative z-10 flex justify-center mb-6">
                <div className="glass-3d w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden p-2 flex items-center justify-center transition-all duration-300 hover:border-white/40 relative">
                  <img 
                    src={profilePicture} 
                    alt="Rhenel" 
                    fetchPriority="high"
                    loading="eager"
                    decoding="sync"
                    className="w-full h-full rounded-xl object-cover object-center sepia-[0.25] saturate-[0.88] contrast-[1.12] brightness-[0.96]"
                  />
                  <div className="absolute inset-2 pointer-events-none rounded-xl bg-radial from-transparent via-transparent to-black/40 mix-blend-multiply" />
                </div>
              </div>

              {/* Name and Title */}
              <div className="relative z-10 text-center mb-6">
                <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">
                  Rhenel Jhon Sajol
                </h3>
                <p className="text-gray-300 text-base sm:text-lg mb-1">
                  Computer Science Student
                </p>
                <p className="text-cyan-300 text-sm sm:text-base font-medium">
                  Aspiring Developer
                </p>
              </div>

              {/* Contact Information */}
              <div className="relative z-10 space-y-3 text-white text-sm sm:text-base border-t border-white/10 pt-5">
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
            <div className="glass-3d rounded-2xl p-6 sm:p-8 hover:border-pink-300/60 transition-all duration-300">
              <h3 className="relative z-10 text-white text-xl sm:text-2xl font-bold mb-4">
                Biography
              </h3>
              <p className="relative z-10 text-gray-200 text-sm sm:text-base leading-relaxed">
              I am Rhenel Jhon Sajol, a Computer Science student with a strong interest in full-stack web development. I have experience with frontend technologies such as React.js, Next.js, TypeScript, and Tailwind CSS, as well as backend technologies including Django, Flask, and FastAPI. I also work with Supabase for authentication, databases, and backend services. My focus is on building functional systems, writing clean and maintainable code, and continuously improving my skills in UI design and real-world web application development.
              </p>
            </div>

            {/* Skills Card */}
            <div className="glass-3d rounded-2xl p-6 sm:p-8 hover:border-pink-300/60 transition-all duration-300">
              <h3 className="relative z-10 text-white text-xl sm:text-2xl font-bold mb-6">
                Skills
              </h3>
              <div className="relative z-10 space-y-5">
                {Object.entries(skills).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="text-white text-base sm:text-lg font-semibold mb-2.5">
                      {category}:
                    </h4>
                    <div className="glass-3d rounded-xl p-3 sm:p-4 min-h-[60px]">
                      <div className="relative z-10 flex flex-wrap gap-2">
                        {items.map((skill, index) => (
                          <span
                            key={index}
                            className="glass-3d-pill inline-block px-3 py-1 rounded-lg text-white text-xs sm:text-sm hover:border-pink-300/60 transition-all duration-300"
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


