require('dotenv').config();
const mongoose = require('mongoose');
const { Event } = require('./models/Event');
const { User } = require('./models/User');
const { connectDB } = require('./config/db');

const sampleEvents = [
  {
    title: 'HackInnovate 2026: 36-Hour National Hackathon',
    description: 'Join over 500 developers, designers, and innovators to solve real-world problems in AI, Climate Tech, and Web3. Mentorship from industry leaders and $10,000+ in prize pools.',
    category: 'Hackathon',
    department: 'Computer Science',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    time: '09:00 AM - 09:00 PM',
    venue: 'Campus Innovation Hub, Block C Auditorium',
    organizer: 'CS Student Society & ACM Chapter',
    organizerEmail: 'hackinnovate@college.edu',
    capacity: 250,
    registrationCount: 142,
    status: 'Upcoming',
    bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    tags: ['hackathon', 'coding', 'ai', 'innovation'],
    isFeatured: true
  },
  {
    title: 'Hands-on Generative AI & LLM Deployment Workshop',
    description: 'Deep dive into building and deploying LLM applications with LangChain, Vector Databases, and local fine-tuning. Bring your laptop with Python 3.11 installed.',
    category: 'Workshop',
    department: 'Information Technology',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    time: '02:00 PM - 05:30 PM',
    venue: 'Lab 402, Turing Computational Center',
    organizer: 'AI & Data Science Club',
    organizerEmail: 'aiclub@college.edu',
    capacity: 60,
    registrationCount: 58,
    status: 'Upcoming',
    bannerUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
    tags: ['ai', 'workshop', 'llm', 'python'],
    isFeatured: true
  },
  {
    title: 'Tarang 2026: Annual Inter-College Cultural Gala',
    description: 'The biggest cultural extravaganza of the semester! Featuring live band battles, classical and modern dance competitions, fashion runway, and celebrity music concert.',
    category: 'Cultural',
    department: 'General College',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    time: '04:00 PM - 10:00 PM',
    venue: 'Main Open Air Amphitheatre',
    organizer: 'Student Cultural Council',
    organizerEmail: 'cultural@college.edu',
    capacity: 1200,
    registrationCount: 650,
    status: 'Upcoming',
    bannerUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    tags: ['music', 'dance', 'cultural', 'fest'],
    isFeatured: true
  },
  {
    title: 'RoboWars & Drone Racing Challenge',
    description: 'Design, build, and combat! Witness 15kg robot battle matches in our reinforced bulletproof arena, followed by an obstacle drone agility course.',
    category: 'Technical',
    department: 'Mechanical',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    time: '10:00 AM - 04:00 PM',
    venue: 'Indoor Sports Complex & Quad',
    organizer: 'Robotics & Mechatronics Society',
    organizerEmail: 'robotics@college.edu',
    capacity: 300,
    registrationCount: 180,
    status: 'Upcoming',
    bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    tags: ['robotics', 'engineering', 'hardware'],
    isFeatured: false
  },
  {
    title: 'Inter-Department Cricket & Football Tournament',
    description: 'Annual league championship between all departments. 8 teams, league stages, and finals under floodlights. Trophy and medals awarded to winners.',
    category: 'Sports',
    department: 'General College',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    time: '08:00 AM - 06:00 PM',
    venue: 'University Sports Grounds',
    organizer: 'Department of Physical Education',
    organizerEmail: 'sports@college.edu',
    capacity: 500,
    registrationCount: 310,
    status: 'Upcoming',
    bannerUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
    tags: ['sports', 'cricket', 'football', 'fitness'],
    isFeatured: false
  },
  {
    title: 'Executive Leadership & Entrepreneurship Summit',
    description: 'Keynotes from successful unicorn startup founders, venture capitalists, and alumni. Includes pitch deck session with seed funding opportunities.',
    category: 'Seminar',
    department: 'Management',
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    time: '11:00 AM - 03:00 PM',
    venue: 'Senate Hall, Management Block',
    organizer: 'E-Cell & MBA Association',
    organizerEmail: 'ecell@college.edu',
    capacity: 200,
    registrationCount: 165,
    status: 'Upcoming',
    bannerUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    tags: ['entrepreneurship', 'leadership', 'startups'],
    isFeatured: false
  }
];

const sampleUsers = [
  {
    name: 'Dr. Alan Turing',
    email: 'admin@college.edu',
    password: 'Password123',
    role: 'admin',
    department: 'Computer Science',
    studentId: ''
  },
  {
    name: 'Sarah Jenkins',
    email: 'student@college.edu',
    password: 'Password123',
    role: 'student',
    department: 'Computer Science',
    studentId: 'CS2026-104'
  }
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log('[Seed] Clearing existing events and users...');
    await Event.deleteMany({});
    await User.deleteMany({});

    console.log('[Seed] Inserting sample college events...');
    const createdEvents = await Event.insertMany(sampleEvents);

    console.log('[Seed] Inserting sample admin & student users...');
    for (const u of sampleUsers) {
      // Create users individually so pre-save password hash hook executes
      const user = new User(u);
      if (u.role === 'student' && createdEvents.length > 0) {
        user.registeredEvents = [createdEvents[0]._id];
      }
      await user.save();
    }

    console.log(`[Seed] Successfully seeded ${sampleEvents.length} events and ${sampleUsers.length} users!`);
    console.log('[Seed] Admin login:   admin@college.edu / Password123');
    console.log('[Seed] Student login: student@college.edu / Password123');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedDB();
}

module.exports = { sampleEvents, seedDB };
