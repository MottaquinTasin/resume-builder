import type { ResumeData } from './types';

export const defaultResumeData: ResumeData = {
  template: 'classic',
  accentColor: '#2563EB',
  sections: [
    {
      id: 'contact',
      type: 'contact',
      enabled: true,
      data: {
        name: 'Alex Johnson',
        email: 'alex.johnson@email.com',
        phone: '+1 (555) 123-4567',
        location: 'San Francisco, CA',
        website: 'alexjohnson.dev',
        linkedin: 'linkedin.com/in/alexjohnson',
        github: 'github.com/alexjohnson',
      },
    },
    {
      id: 'summary',
      type: 'summary',
      enabled: true,
      data: {
        text: 'Results-driven software engineer with 5+ years of experience building scalable web applications. Passionate about clean code, developer experience, and shipping products users love. Strong background in React, TypeScript, and Node.js.',
      },
    },
    {
      id: 'experience',
      type: 'experience',
      enabled: true,
      data: {
        items: [
          {
            id: 'exp-1',
            company: 'Acme Corp',
            title: 'Senior Software Engineer',
            location: 'San Francisco, CA',
            startDate: 'Jan 2022',
            endDate: '',
            current: true,
            bullets: [
              'Led migration of monolith to microservices, reducing deployment time by 60%.',
              'Built real-time dashboard used by 10,000+ daily active users.',
              'Mentored 3 junior engineers, conducting weekly code reviews.',
            ],
          },
          {
            id: 'exp-2',
            company: 'Startup XYZ',
            title: 'Software Engineer',
            location: 'Remote',
            startDate: 'Jun 2019',
            endDate: 'Dec 2021',
            current: false,
            bullets: [
              'Developed core product features using React and GraphQL.',
              'Improved API response times by 40% through caching and query optimization.',
              'Collaborated with design to ship 12 major product releases.',
            ],
          },
        ],
      },
    },
    {
      id: 'education',
      type: 'education',
      enabled: true,
      data: {
        items: [
          {
            id: 'edu-1',
            school: 'University of California, Berkeley',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            location: 'Berkeley, CA',
            startDate: '2015',
            endDate: '2019',
            gpa: '3.8',
          },
        ],
      },
    },
    {
      id: 'skills',
      type: 'skills',
      enabled: true,
      data: {
        categories: [
          { id: 'sk-1', name: 'Languages', skills: 'TypeScript, JavaScript, Python, Go' },
          { id: 'sk-2', name: 'Frameworks', skills: 'React, Next.js, Node.js, Express, GraphQL' },
          { id: 'sk-3', name: 'Tools', skills: 'Git, Docker, AWS, PostgreSQL, Redis' },
        ],
      },
    },
    {
      id: 'projects',
      type: 'projects',
      enabled: true,
      data: {
        items: [
          {
            id: 'proj-1',
            name: 'OpenDash',
            description: 'Open-source analytics dashboard',
            technologies: 'Next.js, TypeScript, Chart.js, PostgreSQL',
            link: 'github.com/alexjohnson/opendash',
            bullets: [
              'Built an open-source analytics platform with 2,000+ GitHub stars.',
              'Supports custom dashboards, data connectors, and real-time charts.',
            ],
          },
        ],
      },
    },
    {
      id: 'certifications',
      type: 'certifications',
      enabled: false,
      data: {
        items: [
          {
            id: 'cert-1',
            name: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
            date: 'Mar 2023',
            link: '',
          },
        ],
      },
    },
    {
      id: 'languages',
      type: 'languages',
      enabled: false,
      data: {
        items: [
          { id: 'lang-1', language: 'English', proficiency: 'Native' },
          { id: 'lang-2', language: 'Spanish', proficiency: 'Proficient' },
        ],
      },
    },
  ],
};
