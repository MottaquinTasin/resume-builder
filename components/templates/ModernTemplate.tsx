import type { Section, ContactData, SummaryData, ExperienceData, EducationData, SkillsData, ProjectsData, CertificationsData, LanguagesData } from '@/lib/types';

interface Props {
  sections: Section[];
  accentColor: string;
}

function SidebarTitle({ title }: { title: string }) {
  return (
    <h2 style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#fff', marginBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: 3 }}>
      {title}
    </h2>
  );
}

function MainTitle({ title, color }: { title: string; color: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <h2 style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</h2>
      <div style={{ height: 1.5, backgroundColor: color, opacity: 0.3 }} />
    </div>
  );
}

export default function ModernTemplate({ sections, accentColor }: Props) {
  const get = <T,>(type: string) => sections.find((s) => s.type === type && s.enabled)?.data as T | undefined;

  const contact = get<ContactData>('contact');
  const summary = get<SummaryData>('summary');
  const experience = get<ExperienceData>('experience');
  const education = get<EducationData>('education');
  const skills = get<SkillsData>('skills');
  const projects = get<ProjectsData>('projects');
  const activities = get<ExperienceData>('activities');
  const certifications = get<CertificationsData>('certifications');
  const languages = get<LanguagesData>('languages');

  const sidebarSections = sections.filter((s) => s.enabled && ['skills', 'certifications', 'languages'].includes(s.type));
  const mainSections = sections.filter((s) => s.enabled && ['summary', 'experience', 'education', 'projects', 'activities'].includes(s.type));

  return (
    <div style={{ display: 'flex', height: '100%', fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: 10, color: '#1a1a1a' }}>
      {/* Sidebar */}
      <div style={{ width: 185, backgroundColor: accentColor, color: '#fff', padding: '20px 14px', flexShrink: 0 }}>
        {contact && (
          <div style={{ marginBottom: 16 }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 6 }}>
              {contact.name || 'Your Name'}
            </h1>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.85)', lineHeight: 1.8 }}>
              {contact.email && <div>{contact.email}</div>}
              {contact.phone && <div>{contact.phone}</div>}
              {contact.location && <div>{contact.location}</div>}
              {contact.website && <div>{contact.website}</div>}
              {contact.linkedin && <div>{contact.linkedin}</div>}
              {contact.github && <div>{contact.github}</div>}
            </div>
          </div>
        )}

        {sidebarSections.map((section) => (
          <div key={section.id} style={{ marginBottom: 14 }}>
            {section.type === 'skills' && skills && (
              <>
                <SidebarTitle title="Skills" />
                {skills.categories.map((cat) => (
                  <div key={cat.id} style={{ marginBottom: 6 }}>
                    {cat.name && <p style={{ fontSize: 8.5, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 2 }}>{cat.name}</p>}
                    <p style={{ fontSize: 8.5, color: 'rgba(255,255,255,0.8)' }}>{cat.skills}</p>
                  </div>
                ))}
              </>
            )}

            {section.type === 'certifications' && certifications && (
              <>
                <SidebarTitle title="Certifications" />
                {certifications.items.map((item) => (
                  <div key={item.id} style={{ marginBottom: 6 }}>
                    <p style={{ fontSize: 8.5, fontWeight: 700, color: '#fff' }}>{item.name}</p>
                    <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.7)' }}>{item.issuer} · {item.date}</p>
                  </div>
                ))}
              </>
            )}

            {section.type === 'languages' && languages && (
              <>
                <SidebarTitle title="Languages" />
                {languages.items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 8.5, fontWeight: 700, color: '#fff' }}>{item.language}</span>
                    <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.7)' }}>{item.proficiency}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '20px 18px' }}>
        {mainSections.map((section) => (
          <div key={section.id} style={{ marginBottom: 14 }}>
            {section.type === 'summary' && summary && (
              <>
                <MainTitle title="About Me" color={accentColor} />
                <p style={{ fontSize: 9.5, color: '#444', lineHeight: 1.5 }}>{summary.text}</p>
              </>
            )}

            {section.type === 'experience' && experience && (
              <>
                <MainTitle title="Experience" color={accentColor} />
                {experience.items.map((item) => (
                  <div key={item.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 10.5 }}>{item.title || 'Job Title'}</span>
                        {item.company && (
                          <span style={{ fontSize: 9.5, color: accentColor, fontWeight: 600 }}> @ {item.company}</span>
                        )}
                      </div>
                      <span style={{ fontSize: 8.5, color: '#888', whiteSpace: 'nowrap', flexShrink: 0, paddingLeft: 10, textAlign: 'right' }}>
                        {item.startDate}{(item.startDate && (item.current || item.endDate)) ? ' – ' : ''}{item.current ? 'Present' : item.endDate}
                      </span>
                    </div>
                    {item.location && <p style={{ fontSize: 8.5, color: '#888', marginTop: 1 }}>{item.location}</p>}
                    {item.bullets.filter(Boolean).length > 0 && (
                      <ul style={{ margin: '5px 0 0 14px', padding: 0 }}>
                        {item.bullets.filter(Boolean).map((b, i) => (
                          <li key={i} style={{ fontSize: 9.5, color: '#333', marginBottom: 2, lineHeight: 1.4 }}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </>
            )}

            {section.type === 'education' && education && (
              <>
                <MainTitle title="Education" color={accentColor} />
                {education.items.map((item) => (
                  <div key={item.id} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, fontSize: 10 }}>{item.school || 'School'}</span>
                      <span style={{ fontSize: 8.5, color: '#888' }}>
                        {[item.startDate, item.endDate].filter(Boolean).join(' – ')}
                      </span>
                    </div>
                    {(item.degree || item.field) && (
                      <p style={{ fontSize: 9.5, color: '#555' }}>{[item.degree, item.field].filter(Boolean).join(' in ')}</p>
                    )}
                    {item.gpa && <p style={{ fontSize: 9, color: '#777' }}>GPA: {item.gpa}</p>}
                  </div>
                ))}
              </>
            )}

            {section.type === 'projects' && projects && (
              <>
                <MainTitle title="Projects" color={accentColor} />
                {projects.items.map((item) => (
                  <div key={item.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontWeight: 700, fontSize: 10 }}>{item.name || 'Project'}</span>
                      {item.link && <span style={{ fontSize: 8.5, color: accentColor }}>{item.link}</span>}
                    </div>
                    {item.technologies && <p style={{ fontSize: 8.5, color: '#888', fontStyle: 'italic', marginTop: 1 }}>{item.technologies}</p>}
                    {item.bullets.filter(Boolean).length > 0 && (
                      <ul style={{ margin: '4px 0 0 14px', padding: 0 }}>
                        {item.bullets.filter(Boolean).map((b, i) => (
                          <li key={i} style={{ fontSize: 9.5, color: '#333', marginBottom: 2 }}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </>
            )}

            {section.type === 'activities' && activities && (
              <>
                <MainTitle title="Activities" color={accentColor} />
                {activities.items.map((item) => (
                  <div key={item.id} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 10.5 }}>{item.title || 'Role'}</span>
                        {item.company && <span style={{ fontSize: 9.5, color: accentColor, fontWeight: 600 }}> @ {item.company}</span>}
                      </div>
                      <span style={{ fontSize: 8.5, color: '#888', whiteSpace: 'nowrap', flexShrink: 0, paddingLeft: 10, textAlign: 'right' }}>
                        {item.startDate}{(item.startDate && (item.current || item.endDate)) ? ' – ' : ''}{item.current ? 'Present' : item.endDate}
                      </span>
                    </div>
                    {item.location && <p style={{ fontSize: 8.5, color: '#888', marginTop: 1 }}>{item.location}</p>}
                    {item.bullets.filter(Boolean).length > 0 && (
                      <ul style={{ margin: '5px 0 0 14px', padding: 0 }}>
                        {item.bullets.filter(Boolean).map((b, i) => (
                          <li key={i} style={{ fontSize: 9.5, color: '#333', marginBottom: 2 }}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
